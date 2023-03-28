# Install AWS CLI 

https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions

# Configure SSO session

Use following document to configure your aws credentials via AWS SSO
https://docs.aws.amazon.com/cli/latest/userguide/sso-configure-profile-token.html


# View AWS service logs
aws logs tail --follow --region us-east-2 <log_group_name>  --since  <time>

example:
for past 5 minutes logs 

aws logs tail --follow --region us-east-2 /ferrum/ecs/multiswap-node  --since 5m


