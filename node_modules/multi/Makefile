
default:
		@echo; echo "Actions: test | lint | all"; echo
		
all: lint test

test:
		@./node_modules/.bin/vows --spec test/*.js
      
lint:
		@./node_modules/.bin/jshint -c jshint.json lib/multi.js test/*.js test/fixtures/*.js
		
.PHONY: test