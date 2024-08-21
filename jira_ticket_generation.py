import json
import requests
from requests.auth import HTTPBasicAuth

def lambda_handler(event, context):
    agent = event['agent']
    actionGroup = event['actionGroup']
    function = event['function']
    parameters = event.get('parameters', [])
    
    # Extract parameters from event
    param_dict = {param["name"]: param["value"] for param in parameters}
    
    summary = param_dict.get("summary")
    # Determine the description
    description = param_dict.get("description", summary) or summary
    
    # Jira API details
    url = "https://boppanasurya58.atlassian.net/rest/api/3/issue"
    api_token = "ATATT3xFfGF0uu1V_Vm8Peeqbh-om5Hi4waLP2TXH3zTQq8EN-QVRl6FsFBDLulAiJEeVDUKQDBAsS2meD6evbVEDHl_p9WbXM9cz9y2HL5l3eM3My50dqpCFxAyrYmxfRXyxW21PYRAAwPanQ8JykFr9inR_3UGNS9PjvFzJhBgTOi-9zS83zg=188EF2B8"
    # Replace the api_token with a new token (this one is expired)
    jira_emailid = "boppanasurya58@gmail.com"
    
    # HTTP headers
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    
    # Payload for Jira ticket creation
    payload = json.dumps({
        "fields": {
            "assignee": {
                "id": "712020:d6e3da24-0a1c-4dc3-9a87-d95434bb939b"
            },
            "description": {
                "content": [
                    {
                        "content": [
                            {
                                "text": description,
                                "type": "text"
                            }
                        ],
                        "type": "paragraph"
                    }
                ],
                "type": "doc",
                "version": 1
            },
            "issuetype": {
                "id": "10001"
            },
            "labels": [
                "bugfix",
                "blitz_test"
            ],
            "project": {
                "id": "10000"
            },
            "reporter": {
                "id": "712020:d6e3da24-0a1c-4dc3-9a87-d95434bb939b"
            },
            "summary": summary
        },
        "update": {}
    })
    
    try:
        # Sending POST request to create Jira issue
        response = requests.post(
            url,
            data=payload,
            headers=headers,
            auth=HTTPBasicAuth(jira_emailid, api_token)
        )
        
        # Check if the request was successful
        if response.status_code == 201:  # 201 Created
            response_data = response.json()
            issue_key = response_data['key']
            html_url = response_data['self'].split('/rest/api')[0] + "/browse/" + issue_key
            
            responseBody = {
                "TEXT": {
                    "body": "The Jira ticket was created successfully! Please follow {} for more updates.".format(html_url)
                }
            }
        else:
            responseBody = {
                "TEXT": {
                    "body": "Error creating ticket. Status code = {}".format(response.status_code)
                }
            }
        
    except Exception as e:
        responseBody = {
            "TEXT": {
                "body": "An error occurred: {}".format(str(e))
            }
        }

    # Construct action response
    action_response = {
        'actionGroup': actionGroup,
        'function': function,
        'functionResponse': {
            'responseBody': responseBody
        }
    }
    
    # Response with versioning
    dummy_function_response = {
        'response': action_response,
        'messageVersion': event.get('messageVersion', '1.0')  # Default to '1.0' if not provided
    }
    
    print("Response: {}".format(json.dumps(dummy_function_response, indent=4)))
    
    return dummy_function_response






