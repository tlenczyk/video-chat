TEMPLATE_NAME ?= janus

run: image
	docker rm $(TEMPLATE_NAME)
	docker run -ti -p 7889:7889 -p 8089:8089 -t --name $(TEMPLATE_NAME) $(TEMPLATE_NAME)

daemon: image
	docker run -d -p 7889:7889 -p 8089:8089 -t --name $(TEMPLATE_NAME) $(TEMPLATE_NAME)

shell: image
	docker run -p 7889:7889 -p 8089:8089 -a stdin -a stdout -i -t --name $(TEMPLATE_NAME) $(TEMPLATE_NAME) /bin/bash

image:
	docker build -t $(TEMPLATE_NAME) .

stop:
	docker ps | grep janus | cut -f1 -d' ' | xargs docker stop
