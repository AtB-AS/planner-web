#!/bin/bash

if [ "$#" -ne 4 ]
then
    echo "Argument error!"
    echo "First argument should be the Slack token"
    echo "Second argument should be the Slack channel"
    echo "Third argument should be the GitHub run id"
    echo "Fourth argument should be type of test"
    exit 1
else
    SLACK_TOKEN=$1
    SLACK_CHANNEL=$2
    GH_RUN_ID=$3
    TEST_TYPE=$4
    GH_REF="https://github.com/AtB-AS/planner-web/actions/runs/${GH_RUN_ID}"
    echo "GitHub run url"
    echo "$GH_REF"
    echo "GitHub run id"
    echo "$GH_RUN_ID"
      
    # Error or success
    if find e2e-tests/k6/logs -maxdepth 1 -name "errors.log" | grep -q .; then
      #ERRORS=$(cat e2e-tests/k6/logs/errors.log)
      #ERRORS=$(sed ':a;N;$!ba;s/"/\\"/g;s/\n/\\n/g' e2e-tests/k6/logs/errors.log) #TODO TEST
      #ERRORS=$(awk '{gsub(/"/,"\\\""); printf "%s%s", (NR>1?"\\n":""), $0}' logs/errors.log) #TODO TEST

      # TODO TEST
      #ERRORS=$(awk 'NR>1 {print ""} {printf "%s", $0}' logs/errors.log)
      #PAYLOAD=$(jq -n --arg text "$ERRORS" '{ text: $text }')
      #printf '%s\n' "$PAYLOAD" | jq -r '.text'
      ERRORS=$(awk 'NR>1 {print ""} {printf "%s", $0}' e2e-tests/k6/logs/errors.log)
      ERRORS_JSON=$(jq -n --arg text "$ERRORS" 'text: $text') # Endre til Slack-format
      PAYLOAD_DETAILS=$(jq -n --arg text "$ERRORS" "{\"channel\": \"${SLACK_CHANNEL}\",${ERRORS_JSON}}")

      #PAYLOAD="{\"channel\": \"${SLACK_CHANNEL}\", \"blocks\": [{\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \"\n\"}}, {\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \":warning: *Errors in Planner Web (Test: ${TEST_TYPE}, <${GH_REF}|ref>)*\"}}, {\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \"${ERRORS}\"}}]}"
      PAYLOAD="{\"channel\": \"${SLACK_CHANNEL}\", \"blocks\": [{\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \"\n\"}}, {\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \":warning: *Errors in Planner Web (Test: ${TEST_TYPE}, <${GH_REF}|ref>)*\"}}]}"

      # Send slack notification
      curl -H "Content-type: application/json" \
        --data "${PAYLOAD}" \
        -H "Authorization: Bearer ${SLACK_TOKEN}" \
        -X POST https://slack.com/api/chat.postMessage
      echo ""
      echo "** Slack notification sent: errors **"
      curl -H "Content-type: application/json" \
        --data "${PAYLOAD_DETAILS}" \
        -H "Authorization: Bearer ${SLACK_TOKEN}" \
        -X POST https://slack.com/api/chat.postMessage
      echo ""
      echo "** Slack notification sent: error details **"
    else
      PAYLOAD="{\"channel\": \"${SLACK_CHANNEL}\", \"blocks\": [{\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \"\n\"}}, {\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \":white_check_mark: *All good for Planner Web (Test: ${TEST_TYPE}, <${GH_REF}|ref>)*\"}}]}"

      # Send slack notification
      curl -H "Content-type: application/json" \
        --data "${PAYLOAD}" \
        -H "Authorization: Bearer ${SLACK_TOKEN}" \
        -X POST https://slack.com/api/chat.postMessage
      echo ""
      echo "** Slack notification sent: success **"
    fi
       

fi
