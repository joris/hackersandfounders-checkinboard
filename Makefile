.PHONY: deploy

deploy:
	gulp
	rsync -uva dist/ deploy@web3:applications/hackersandfounders.nl/shared/board
  # rsync -uva dist/board/ deploy@web3:applications/hackersandfounders.nl/shared/board
