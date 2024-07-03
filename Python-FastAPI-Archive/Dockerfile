FROM python:slim
EXPOSE 8000

RUN mkdir -p /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN pip3 install --user -r requirements.txt

ENTRYPOINT ["/root/.local/bin/fastapi", "run", "main.py"]