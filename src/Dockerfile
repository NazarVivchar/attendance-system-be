FROM public.ecr.aws/bitnami/node:14 as build

WORKDIR /docker-build

COPY package.json ./
COPY yarn.lock ./

RUN npm install

COPY . ./

RUN npm build

# ---
FROM public.ecr.aws/bitnami/node:14

WORKDIR /docker-build

COPY --from=build ./docker-build/dist/apps/primary-service  ./
COPY --from=build ./docker-build/node_modules  ./node_modules
COPY --from=build ./docker-build/apps/primary-service/configs  ./configs

EXPOSE 5000
ENTRYPOINT [ "node" ]
CMD [ "main.js" ]