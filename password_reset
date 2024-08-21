# Final Edit on 02/08/2024
# Sending OTP to EMail
# Validating that OTP
# If Validated then Send reset link to mail Id provided.
import json
import random
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import time

# Configuration - Ensure these values are correct in your AWS Lambda environment variables
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 465
SENDER_EMAIL = 'tulasee@brightcone.ai'  # Replace with your email address
EMAIL_PASSWORD = 'aznk ozxs gycp skaw'  # Replace with your email password
# SENDER_EMAIL = "prashanthb.bandi@gmail.com"
# EMAIL_PASSWORD = "makxoucqqdshigor"

# In-memory storage for OTPs (for demonstration purposes)
otp_store = {}

def lambda_handler(event, context):
    agent = event.get('agent', '')
    actionGroup = event.get('actionGroup', '')
    function = event.get('function', '')
    parameters = event.get('parameters', [])
    
    def generate_otp(length=6):
        return ''.join([str(random.randint(0, 9)) for _ in range(length)])
    
    def send_otp_email(username, application, otp):
        receiver_email = username
        
        message = MIMEMultipart("alternative")
        message["Subject"] = "Password Resetting credentials for " + application
        message["From"] = SENDER_EMAIL
        message["To"] = receiver_email
        
        # Create the HTML content for the email
        html = """\
        <html>
        <body>
            <p>Hi,<br>
            You requested for a Password Reset. Please use the OTP below to reset your password:<br>
            Username: {}<br>
            One-Time Password (OTP): {}<br>
            <br>
            Thank you!
            </p>
        </body>
        </html>
        """.format(username, otp)
        
        part2 = MIMEText(html, "html")
        message.attach(part2)
        
        try:
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(EMAIL_HOST, EMAIL_PORT, context=context) as server:
                server.login(SENDER_EMAIL, EMAIL_PASSWORD)
                server.sendmail(SENDER_EMAIL, receiver_email, message.as_string())
            print("OTP sent successfully to your email: {}".format(username))
        except Exception as e:
            print(f"Error sending email: {e}")
    
    def send_reset_link_email(username, reset_link):
        receiver_email = username
        
        message = MIMEMultipart("alternative")
        message["Subject"] = "Reset Your Password "
        message["From"] = SENDER_EMAIL
        message["To"] = receiver_email
        
        # Create the HTML content for the email
        html = """\
        <html>
        <body>
            <p>Hi,<br>
            You requested for a Password Reset. Please click the below link to reset your password:<br>
            Username: {}<br>
            <br>
            Link: {}<br>
            <br>
            If you have any further queries, please reach out to help@bart.ai.<br>
            Thank you!
            </p>
        </body>
        </html>
        """.format(username, reset_link)
        
        part2 = MIMEText(html, "html")
        message.attach(part2)
        
        try:
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(EMAIL_HOST, EMAIL_PORT, context=context) as server:
                server.login(SENDER_EMAIL, EMAIL_PASSWORD)
                server.sendmail(SENDER_EMAIL, receiver_email, message.as_string())
            print("Reset link sent successfully to your email: {}".format(username))
        except Exception as e:
            print(f"Error sending email: {e}")
    
    def validate_otp(username, otp):
        if username in otp_store:
            stored_otp = otp_store[username]['otp']
            timestamp = otp_store[username]['timestamp']
            current_time = time.time()
            
            # OTP is valid for 10 minutes (600 seconds)
            if current_time - timestamp <= 600 and otp == stored_otp:
                return True
        return False
    
    # Create the parameter dictionary
    param_dict = {param['name'].lower(): str(param['value']) for param in parameters if param['type'] == 'string'}
    
    print("Extracted parameters:", param_dict)
    print("Function:", function)
    
    responseBody = {}
    
    if function == "password_reset":
        username = param_dict.get('emailid')
        application = param_dict.get('application')
        
        if username is not None and application is not None:
            try:
                username = str(username)
                application = str(application)
                
                otp = generate_otp()
                otp_store[username] = {
                    'otp': otp,
                    'timestamp': time.time()
                }
                send_otp_email(username, application, otp)
                
                result_text = f"An OTP has been sent to your email: {username}"
                
            except ValueError:
                result_text = "Error: non-string parameter"
        else:
            result_text = "Error: Missing one or more required arguments"
        
        responseBody = {
            "TEXT": {
                "body": result_text
            }
        }
    
    elif function == "validate_otp":
        username = param_dict.get('emailid')
        otp = param_dict.get('otp')
        
        if username is not None and otp is not None:
            if validate_otp(username, otp):
                reset_link = f"https://accounts.google.com/v3/signin/challenge/pwd?TL=ALoj5ApjMJ8vKw-GWOv7BVavnMclu2rneM3nVjNlUXVyJ104ni6m8wie77iEuim1&checkConnection=youtube%3A268&checkedDomains=youtube&cid=1&continue=https%3A%2F%2Fmyaccount.google.com%2Fsigninoptions%2Fpassword&ddm=0&flowName=GlifWebSignIn&hl=en_US&ifkv=AdF4I743Opqtu_Z9KK3kBxiO7_4sWwwWICGKq3OaElVTRSb99Wrrt0ySDIoAOVcGK2i33SJ4ieqaOQ&kdi=CAM&pstMsg=1&rart=ANgoxcctfNU6OeWfCmhem0p5jTdIuWZMXfm558C9iDQUCDgwO5Fm5Lk0thqzGien_7ekJGx1Uq5SrEEPbnM_HPzbDptCGSI6NRAurrR2Gd-9XPl3pPwR0bs&rpbg=1&sarp=1&scc=1&service=accountsettings"
                send_reset_link_email(username, reset_link)
                result_text = f"The reset link has been sent to your email: {username}"
            else:
                result_text = "OTP is invalid or has expired."
        else:
            result_text = "Error: Missing username or OTP."
        
        responseBody = {
            "TEXT": {
                "body": result_text
            }
        }
    
    else:
        responseBody = {
            "TEXT": {
                "body": "Error: Function not recognized"
            }
        }

    action_response = {
        'actionGroup': actionGroup,
        'function': function,
        'functionResponse': {
            'responseBody': responseBody
        }
    }
    
    dummy_function_response = {'response': action_response, 'messageVersion': event.get('messageVersion', '1.0')}
    print("Response:", json.dumps(dummy_function_response, indent=2))
    
    return dummy_function_response







# import json
# import boto3
# import random
# import smtplib, ssl
# import string
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart







# def lambda_handler(event, context):
#     agent = event.get('agent')
#     actionGroup = event.get('actionGroup')
#     function = event.get('function')
#     parameters = event.get('parameters', [])
    
#     def generate_otp(length=6):
#         return ''.join([str(random.randint(0, 9)) for _ in range(length)])
    
#     def send_sms_via_sns(phone_number):
#         otp = generate_otp()
#         sns_client = boto3.client('sns')
#         try:
#             response = sns_client.publish(
#                 PhoneNumber=phone_number,
#                 Message=f"Your OTP is: {otp}"
#             )
#             print(f"SMS sent to {phone_number}. Response: {response}")
#         except Exception as e:
#             print(f"Error sending SMS: {e}")
#             return None
        
#         return phone_number, otp
    

#     param_dict = {param['name'].lower(): param['value'] for param in parameters if param['type'] == 'string'}
#     responseBody = {}
    
#     if function == "send_sms_via_sns":
#         phone_number = param_dict.get('phonenumber')
#         if phone_number:
#             try:
#                 phone_number, otp = send_sms_via_sns(phone_number)
#                 reset_link = f"https://accounts.google.com/v3/signin/challenge/pwd?TL=ALoj5ApjMJ8vKw-GWOv7BVavnMclu2rneM3nVjNlUXVyJ104ni6m8wie77iEuim1&checkConnection=youtube%3A268&checkedDomains=youtube&cid=1&continue=https%3A%2F%2Fmyaccount.google.com%2Fsigninoptions%2Fpassword&ddm=0&flowName=GlifWebSignIn&hl=en_US&ifkv=AdF4I743Opqtu_Z9KK3kBxiO7_4sWwwWICGKq3OaElVTRSb99Wrrt0ySDIoAOVcGK2i33SJ4ieqaOQ&kdi=CAM&pstMsg=1&rart=ANgoxcctfNU6OeWfCmhem0p5jTdIuWZMXfm558C9iDQUCDgwO5Fm5Lk0thqzGien_7ekJGx1Uq5SrEEPbnM_HPzbDptCGSI6NRAurrR2Gd-9XPl3pPwR0bs&rpbg=1&sarp=1&scc=1&service=accountsettings"
                
#                 result_text = (
#                     f"Your phone number is: {phone_number}\n"
#                     f"Your OTP is: {otp}\n"
#                     f"Please use the following link to reset your password:\n"
#                     f"{reset_link}\n"
#                     f"The same link is forwarded to your email too...."
#                 )
#             except ValueError as e:
#                 result_text = str(e)
#         else:
#             result_text = "Error: Missing phone number argument"
        
#         responseBody = {
#             "TEXT": {
#                 "body": result_text
#             }
#         }
#     else:
#         responseBody = {
#             "TEXT": {
#                 "body": "Error: Function not recognized"
#             }
#         }

#     action_response = {
#         'actionGroup': actionGroup,
#         'function': function,
#         'functionResponse': {
#             'responseBody': responseBody
#         }
#     }

#     dummy_function_response = {
#         'response': action_response,
#         'messageVersion': event.get('messageVersion', '1.0')
#     }
#     print("Response:", json.dumps(dummy_function_response, indent=2))
    
#     return dummy_function_response
