FROM postgres:11.3-alpine

# Initializes postgres with databases
COPY init.sql init.test.sql /docker-entrypoint-initdb.d/
