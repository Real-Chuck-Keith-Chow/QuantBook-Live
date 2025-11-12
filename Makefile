.PHONY: setup proto test fmt lint run-server
setup:
\tpython -m pip install -U pip
\tpip install -e . -r requirements.txt
proto:
\tpython -m grpc_tools.protoc -I protos --python_out=server --grpc_python_out=server protos/*.proto
fmt:
\truff check --select I --fix .
\truff format .
lint:
\truff check .
\tmypy server Core
test:
\tpytest -q
run-server:
\tpython server/main.py
