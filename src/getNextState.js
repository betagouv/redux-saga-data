import uniqBy from 'lodash.uniqby'

function getDefaultDatumIdValue (datum, index) {
  return datum.id || index
}

function getDefaultDatumIdKey () {
  return 'id'
}

export function getNextState(state, method, patch, config = {}) {
  // UNPACK
  const { normalizer, isMergingDatum, isMutatingDatum } = config
  const getDatumIdKey = config.getDatumIdKey || getDefaultDatumIdKey
  const getDatumIdValue = config.getDatumIdValue || getDefaultDatumIdValue
  const isMergingArray =
    typeof config.isMergingArray === 'undefined' ? true : config.isMergingArray
  const isMutatingArray =
    typeof config.isMutatingArray === 'undefined'
      ? true
      : config.isMutatingArray
  const nextState = config.nextState || {}

  if (!patch) {
    return state
  }

  Object.keys(patch).forEach(patchKey => {
    // PREVIOUS
    const previousData = state[patchKey]

    // TREAT
    const data = patch[patchKey]
    if (!data) {
      return
    }

    const nextData = uniqBy(
      data.map((datum, index) => {
        // CLONE
        let nextDatum = Object.assign(
          // FORCE TO GIVE AN ID
          { [getDatumIdKey(datum)]: getDatumIdValue(datum, index) },
          datum
        )

        // MAYBE RESOLVE
        if (config.resolve) {
          nextDatum = config.resolve(nextDatum, data, config)
        }

        return nextDatum
      }),
      // UNIFY BY ID
      // (BECAUSE DEEPEST NORMALIZED DATA CAN RETURN ARRAY OF SAME ELEMENTS)
      getDatumIdValue
    )

    // NORMALIZER
    if (normalizer) {
      Object.keys(normalizer).forEach(normalizerKey => {
        let nextNormalizedData = []
        nextData.forEach(nextDatum => {
          if (Array.isArray(nextDatum[normalizerKey])) {
            nextNormalizedData = nextNormalizedData.concat(nextDatum[normalizerKey])
            // replace by an array of ids
            nextDatum[`${normalizerKey}Ids`] = nextDatum[normalizerKey]
              .map(getDatumIdValue)
            // delete
            delete nextDatum[normalizerKey]
          } else if (nextDatum[normalizerKey]) {
            nextNormalizedData.push(nextDatum[normalizerKey])
            delete nextDatum[normalizerKey]
          }
        })

        if (nextNormalizedData.length) {
          // ADAPT BECAUSE NORMALIZER VALUES
          // CAN BE DIRECTLY THE STORE KEYS IN THE STATE
          // OR AN OTHER CHILD NORMALIZER CONFIG
          // IN ORDER TO BE RECURSIVELY EXECUTED
          let nextNormalizer
          let storeKey
          if (typeof normalizer[normalizerKey] === 'string') {
            storeKey = normalizer[normalizerKey]
          } else {
            storeKey = normalizer[normalizerKey].key
            nextNormalizer = normalizer[normalizerKey].normalizer
          }

          // RECURSIVE CALL TO MERGE THE DEEPER NORMALIZED VALUE
          const nextNormalizedState = getNextState(
            state,
            null,
            { [storeKey]: nextNormalizedData },
            {
              isMergingDatum:
                typeof normalizer[normalizerKey].isMergingDatum !== 'undefined'
                  ? normalizer[normalizerKey].isMergingDatum
                  : isMergingDatum,
              isMutatingDatum:
                typeof normalizer[normalizerKey].isMutatingDatum !== 'undefined'
                  ? normalizer[normalizerKey].isMutatingDatum
                  : isMutatingDatum,
              nextState,
              normalizer: nextNormalizer
            }
          )

          // MERGE THE CHILD NORMALIZED DATA INTO THE
          // CURRENT NEXT STATE
          Object.assign(nextState, nextNormalizedState)
        }
      })
    }

    // no need to go further if no previous data
    if (!previousData) {
      nextState[patchKey] = nextData
      return
    }

    // DELETE CASE
    if (method === 'DELETE') {
      const nextDataIds = nextData.map(getDatumIdValue)
      const resolvedData = previousData.filter(
        previousDatum => !nextDataIds.includes(getDatumIdValue(previousDatum))
      )
      nextState[patchKey] = resolvedData
      return
    }

    // GET POST PATCH

    // no need to go further when we want just to trigger
    // a new fresh assign with nextData
    if (!isMergingArray) {
      nextState[patchKey] = nextData
      return
    }

    // Determine first if we are going to trigger a mutation of the array
    const resolvedData = isMutatingArray ? [...previousData] : previousData

    // for each datum we are going to assign (by merging or not) them into
    // their right place in the resolved array
    nextData.forEach(nextDatum => {
      const previousIndex = previousData.findIndex(
        previousDatum => getDatumIdValue(previousDatum) === getDatumIdValue(nextDatum)
      )
      const resolvedIndex =
        previousIndex === -1 ? resolvedData.length : previousIndex

      let datum
      if (isMutatingDatum) {
        datum = Object.assign(
            {},
            isMergingDatum && previousData[previousIndex],
            nextDatum
          )
      } else if (isMergingDatum) {
        datum = previousIndex !== -1
          ? Object.assign(previousData[previousIndex], nextDatum)
          : nextDatum
      } else {
        datum = nextDatum
      }
      resolvedData[resolvedIndex] = datum
    })

    // set
    nextState[patchKey] = resolvedData
  })

  // return
  return nextState
}

export default getNextState
