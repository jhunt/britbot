IMAGE ?= filefrog/britbot:latest

build:
	docker build -t $(IMAGE) .

push: build
	docker push $(IMAGE)
