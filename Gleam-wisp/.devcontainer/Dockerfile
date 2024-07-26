FROM alpine

RUN apk add gleam git bash

WORKDIR "/home"
RUN wget https://s3.amazonaws.com/rebar3/rebar3
RUN chmod +x /home/rebar3
RUN /home/rebar3 local install
ENV PATH="/root/.cache/rebar3/bin:$PATH"

# If you need Node.JS
# RUN apk add nodejs

CMD ["/bin/bash"]