#version 330 core
layout (location = 0) in vec3 position;
layout (location = 1) in vec3 normal;
layout (location = 2) in vec2 texCoords;

uniform vec3 tangent;
uniform vec3 bitangent;

out vec2 TexCoords;
out vec3 normalText;
out vec3 positionPoint;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
    gl_Position = projection * view * model * vec4(position, 1.0);
    TexCoords = texCoords;
	normalText= normal;
	positionPoint=(model*vec4(position,1.0)).xyz;
}