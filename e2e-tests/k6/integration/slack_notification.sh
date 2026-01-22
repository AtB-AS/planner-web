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

    # Error or success
    if find e2e-tests/k6/logs -maxdepth 1 -name "errors.log" | grep -q .; then
      # WARNING: If error details are too long, Slack might give error 79 back. Might need to truncate or split in several messages
      ERRORS=$(awk 'NR>1 {print ""} {printf "%s", $0}' e2e-tests/k6/logs/errors.log)
      PAYLOAD_DETAILS=$(jq -n \
        --arg channel "$SLACK_CHANNEL" \
        --arg text "$ERRORS" '
      {
        channel: $channel,
        text: $text
      }')

      PAYLOAD="{\"channel\": \"${SLACK_CHANNEL}\", \"blocks\": [{\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \"\n\"}}, {\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \":warning: *Errors in Planner Web (Test: ${TEST_TYPE}, <${GH_REF}|ref>)*\"}}]}"

      # Send slack notification
      curl -H "Content-type: application/json" \
        --data "${PAYLOAD}" \
        -H "Authorization: Bearer ${SLACK_TOKEN}" \
        -H "Content-type: application/json; charset=utf-8" \
        -X POST https://slack.com/api/chat.postMessage
      echo ""
      echo "** Slack notification sent: errors **"
      curl -H "Content-type: application/json" \
        --data "${PAYLOAD_DETAILS}" \
        -H "Authorization: Bearer ${SLACK_TOKEN}" \
        -H "Content-type: application/json; charset=utf-8" \
        -X POST https://slack.com/api/chat.postMessage
      echo ""
      echo "** Slack notification sent: error details **"
    else
      PAYLOAD="{\"channel\": \"${SLACK_CHANNEL}\", \"blocks\": [{\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \"\n\"}}, {\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \":white_check_mark: *All good for Planner Web (Test: ${TEST_TYPE}, <${GH_REF}|ref>)*\"}}]}"

      # Send slack notification
      curl -H "Content-type: application/json" \
        --data "${PAYLOAD}" \
        -H "Authorization: Bearer ${SLACK_TOKEN}" \
        -H "Content-type: application/json; charset=utf-8" \
        -X POST https://slack.com/api/chat.postMessage
      echo ""
      echo "** Slack notification sent: success **"
    fi
       

fi
