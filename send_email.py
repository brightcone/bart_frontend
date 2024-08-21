import smtplib
import json
import re
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    agent = event.get('agent', '')
    actionGroup = event.get('actionGroup', '')
    function = event.get('function', '')
    
    # SMTP server configuration
    SMTP_SERVER = 'smtp.gmail.com'
    SMTP_PORT = 587
    SMTP_USERNAME = 'tulasee@brightcone.ai'  # Replace with your email address
    SMTP_PASSWORD = 'aznk ozxs gycp skaw'  # Replace with your email password
    
    logger.info(f"Raw event: {json.dumps(event)}")
    try:
        # Log the incoming event
        logger.info(f"Received event: {json.dumps(event)}")
        parameters = event.get('parameters', [])
        
        param_dict = {param["name"]: param["value"] for param in parameters}
        logger.info(str(param_dict))

        # Extract email details from parameters
        to_addresses = param_dict.get('ToAddresses')
        subject = param_dict.get('Subject')
        body = param_dict.get('Body')

        cc_addresses = param_dict.get('CcAddresses', '')
        bcc_addresses = param_dict.get('BccAddresses', '')

        logger.info(f"To Addresses: {to_addresses}")
        logger.info(f"CC Addresses: {cc_addresses}")
        logger.info(f"BCC Addresses: {bcc_addresses}")

        # Validate input fields
        if not to_addresses:
            raise ValueError('No recipients in the "To" field.')

        # Split addresses into lists
        to_addresses = to_addresses.split(',')
        cc_addresses = cc_addresses.split(',') if cc_addresses else []
        bcc_addresses = bcc_addresses.split(',') if bcc_addresses else []

        # Validate email address formats using a comprehensive regex pattern
        email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        invalid_to_emails = [address for address in to_addresses if not re.match(email_regex, address)]
        invalid_cc_emails = [address for address in cc_addresses if address and not re.match(email_regex, address)]
        invalid_bcc_emails = [address for address in bcc_addresses if address and not re.match(email_regex, address)]

        if invalid_to_emails or invalid_cc_emails or invalid_bcc_emails:
            raise ValueError(f'Invalid email addresses detected: To: {invalid_to_emails}, CC: {invalid_cc_emails}, BCC: {invalid_bcc_emails}')

        # Compose the email message
        msg = MIMEMultipart()
        msg['From'] = SMTP_USERNAME
        msg['To'] = ', '.join(to_addresses)
        if cc_addresses:
            msg['Cc'] = ', '.join(cc_addresses)
        if bcc_addresses:
            msg['Bcc'] = ', '.join(bcc_addresses)
        msg['Subject'] = subject

        # Attach the body content
        body_part = MIMEText(body, 'plain')  # Use 'html' if the body content is in HTML format
        msg.attach(body_part)

        # Send the email using SMTP
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)

        logger.info("Email sent successfully!")
        result_text = "Email was sent successfully"

        # Ask the user if they would like to make any changes
        responseBody = {
            "TEXT": {
                "body": result_text + ". Would you like to make any changes or additions before finalizing?"
            }
        }
    except smtplib.SMTPException as smtp_err:
        logger.error(f"SMTP error: {str(smtp_err)}")
        result_text = "There has been a failure with SMTP."
        
        responseBody = {
            "TEXT": {
                "body": result_text
            }
        }
    except Exception as e:
        logger.error(f"Unhandled exception: {str(e)}")
        result_text = "There has been an unhandled exception."
        
        responseBody = {
            "TEXT": {
                "body": result_text
            }
        }
    
    action_response = {
        'actionGroup': actionGroup,
        'function': function,
        'functionResponse': {
            'responseBody': responseBody
        }
    }
    
    function_response = {'response': action_response, 'messageVersion': '1.0'}
    print("Response:{}".format(function_response))
    
    return function_response
