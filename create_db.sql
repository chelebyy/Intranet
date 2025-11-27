-- Create IntranetDB database
CREATE DATABASE "IntranetDB"
  WITH ENCODING 'UTF8'
  LC_COLLATE = 'Turkish_Turkey.1254'
  LC_CTYPE = 'Turkish_Turkey.1254'
  TEMPLATE template0;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE "IntranetDB" TO intranet_user;
