FILES=scss/modules/header.scss:blocks/header/header.css \
	scss/modules/page.scss:blocks/page/page.css \
  scss/modules/content.scss:blocks/content/content.css

watch:
	sass --watch ${FILES}

generate:
	sass ${FILES}
