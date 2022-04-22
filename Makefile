FILES=scss/modules/header.scss:blocks/header/header.css \
	scss/modules/page.scss:blocks/page/page.css \
  scss/modules/content.scss:blocks/content/content.css \
  scss/modules/functions.scss:blocks/functions/functions.css \
  scss/modules/function.scss:blocks/function/function.css \
  scss/modules/examples.scss:blocks/examples/examples.css

watch:
	sass --watch ${FILES}

generate:
	sass ${FILES}
