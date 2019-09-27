
lib: $(shell find src -type f -name \*.ts) src/parse/generated.js
	rm -R lib || true 
	cp -R -u src lib
	./node_modules/.bin/tsc --project lib

src/parse/generated.js: src/parse/wml.y
	./node_modules/.bin/jison -o $@ src/parse/wml.y 

.PHONY: docs
docs: lib
	./node_modules/.bin/typedoc \
	--mode modules \
	--out $@ \
	--tsconfig lib/tsconfig.json \
	--theme minimal lib  \
	--excludeNotExported \
	--excludePrivate && \
	echo "" > docs/.nojekyll
