FILES=scss/modules/header.scss:blocks/header/header.css \
	scss/modules/page.scss:blocks/page/page.css \
  scss/modules/main.scss:blocks/main/main.css \
  scss/modules/functions.scss:blocks/functions/functions.css \
  scss/modules/function.scss:blocks/function/function.css \
  scss/modules/examples.scss:blocks/examples/examples.css \
  scss/modules/improvement.scss:blocks/improvement/improvement.css

watch:
	sass --watch ${FILES}

generate:
	sass ${FILES}
