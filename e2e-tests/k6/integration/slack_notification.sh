#!/bin/bash

if [ "$#" -ne 3 ]
then
    echo "Argument error!"
    echo "First argument should be the Slack token"
    echo "Second argument should be the Slack channel"
    echo "Third argument should be the GitHub run id"
    exit 1
else
    SLACK_TOKEN=$1
    SLACK_CHANNEL=$2
    GH_RUN_ID=$3
    PAYLOAD=""
      
    # Error or success
    if find e2e-tests/k6/logs -maxdepth 1 -name "errors.log" | grep -q .; then
      ERRORS=$(cat e2e-tests/k6/logs/errors.log)
      GH_REF="https://github.com/AtB-AS/planner-web/actions/runs/${GH_RUN_ID}"
      PAYLOAD="{\"channel\": \"${SLACK_CHANNEL}\", \"blocks\": [{\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \"\n\"}}, {\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \":warning: *Errors in Planner Web (<${GH_REF}|ref>)*\"}}, {\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \"${ERRORS}\"}}]}"
    else
      PAYLOAD="{\"channel\": \"${SLACK_CHANNEL}\", \"blocks\": [{\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \"\n\"}}, {\"type\": \"section\", \"text\": {\"type\": \"mrkdwn\", \"text\": \":white_check_mark: *All good for Planner Web*\"}}]}"
    fi
       
    # Send slack notification
    curl -H "Content-type: application/json" \
      --data "${PAYLOAD}" \
      -H "Authorization: Bearer ${SLACK_TOKEN}" \
      -X POST https://slack.com/api/chat.postMessage

    echo ""
    echo "** Slack notification sent **"
fi
