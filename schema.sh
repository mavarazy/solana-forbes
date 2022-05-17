#/bin/bash

apollo schema:download --endpoint https://hasura.snapihealth.com/v1/graphql --header "X-Hasura-Admin-Secret: ${HASURA_ADMIN_SECRET}"
apollo codegen:generate --target=typescript --tagName=gql --passthroughCustomScalars --no-addTypename --outputFlat libs/types/src/generated

node ./tools/generators/schema/schema-after

yarn format