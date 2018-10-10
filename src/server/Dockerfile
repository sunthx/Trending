FROM golang
WORKDIR $GOPATH/src/server
COPY . $GOPATH/src/server
RUN go get github.com/dlclark/regexp2
RUN go get github.com/pkg/errors
RUN go build .

EXPOSE 8090
ENTRYPOINT ["./server"]