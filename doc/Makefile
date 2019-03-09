dev:
	../node_modules/.bin/concurrently "make watch-build" "make watch-serve"

watch-build:
	../node_modules/.bin/concurrently "make watch-concat" "../node_modules/.bin/nodemon --watch apiary.apib.md -e md --exec \"sh scripts/build.sh\""

watch-concat:
	../node_modules/.bin/nodemon --watch src -e md --exec "sh scripts/concat.sh"

watch-serve:
	../node_modules/.bin/concurrently "nodemon --watch apiary.htm -e htm --exec \"sh scripts/serve_mock.sh\"" "sh scripts/serve_htm.sh"
