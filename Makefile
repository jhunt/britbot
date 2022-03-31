IMAGE ?= filefrog/britbot:latest

build:
	docker build --platform linux/amd64 -t $(IMAGE) .

push: build
	docker push $(IMAGE)
