FROM python:slim
EXPOSE 8000

### Install git ###
RUN apt update
RUN apt install --quiet --yes git 

### Copy code to container ###
RUN mkdir -p /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app

### Run pip for python reqs
RUN pip3 install --no-cache-dir --upgrade --quiet --user -r requirements.txt

### Run Fastapi dev
ENV PATH="${PATH}:/root/.local/bin/"

#CMD fastapi dev main.py
#ENTRYPOINT ["/bin/bash", "-c", "echo hello"]
ENTRYPOINT ["/bin/bash"]