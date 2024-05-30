
Features:
	• User authentication (sign up, login)
	• Creating, reading, updating, and deleting posts
	• Commenting on posts
	• Liking posts
	• User profiles

Architecture / Tech

	• Backend: Node.js with Apollo Server for GraphQL.
	• Database: MongoDB.
	• Authentication: JSON Web Tokens (JWT).
	• Deployment: Docker, Kubernetes.

Sample Build and Deploy using Docker Compose
	1. Download files index.js, Dockerfile, docker-compose.yaml and package.json
	2. docker-compose up --build
	3. http://localhost:4000/graphql


Start App
[ec2-user@ip-172-31-18-248 gql-blog]$ sudo docker-compose up --build -d
Creating network "gql-blog_default" with the default driver
Building app
Step 1/7 : FROM node:14
 ---> 1d12470fa662
Step 2/7 : WORKDIR /usr/src/app
. . . . 

Stop
[ec2-user@ip-172-31-18-248 gql-blog]$ sudo docker-compose down
Stopping blog-platform ... done
Stopping mongo         ... done
Removing blog-platform ... done
Removing mongo         ... done
Removing network gql-blog_default
![image](https://github.com/jvandenbossche/graphql-blog/assets/50995298/9a583d22-2f3b-4292-bfd0-62e962075004)
