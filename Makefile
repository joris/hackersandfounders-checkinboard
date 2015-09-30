.PHONY: deploy

deploy:
	gulp
	rsync -uva dist/ building:public_html/board
