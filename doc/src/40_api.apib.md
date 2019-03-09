## Api

### requestData

#### Arguments

| nom | type | exemple | description |
| -- | -- | -- | -- |
| method | string | "GET" | Méthode HTTP de l'appel Rest |
| path | string | "/users/current" | URL relatif sur l'API (can be without the first trailing slash) |
| config | objet | {key: "value"} | Configuration de comportement voir ci-après |

#### Options Config

| nom | type | exemple | requis | défault | description |
| -- | -- | -- | -- | -- | -- |
| key | string | "bookings" | oui | - | Clé sous laquelle seront stockés les entities dans le store, sous `state.data` |
| normalizer | objet | - | non | `null` | |
| handleSuccess | function | - | oui | `(state, action) => {}` | Callback en cas de succès de l'appel Rest |
| handleFail | function | - |  oui | `(state, action) => {}` | Callback en cas de succès de l'appel Rest |
| isMergingDatum | bool | - | non | `false` | |
| isMutatingDatum | bool | - | non | `false` | |
| isMergingArray | bool | - | non | `false` | |
| isMutatingArray | bool | - | non | `false` | |
| nextState | objet | - | non | `{}` | |
| getSuccessState | function | - | non | `undefined` | |
