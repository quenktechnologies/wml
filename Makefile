lib: $(shell find src -type f -name \*.ts) src/parse/generated.js test
	rm -R lib || true 
	cp -R -u src lib
	./node_modules/.bin/tsc --project lib
	chmod +x lib/main.js

src/parse/generated.js: src/parse/wml.y
	./node_modules/.bin/jison -o $@ src/parse/wml.y 

test: test/dom/wml
	touch $@

test/dom/wml: $(shell find test/dom/wml -type f -name \*.wml)
	lib/main.js --module=../../../lib --dom=../../../lib/dom $@
	touch $@
