#version 330 core
layout (location = 0) in vec3 position;
layout (location = 1) in vec3 normal;
layout (location = 2) in vec2 texCoords;

in vec3 tangent;
in vec3 bitangent;

out vec2 TexCoords;
out vec3 normalText;
out vec3 positionPoint;
out mat3 TBN;
out mat3 transTBN;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out VS_OUT {
    vec3 FragPos;
    vec2 TexCoords;
    vec3 TangentLightPos;
    vec3 TangentViewPos;
    vec3 TangentFragPos;
} vs_out;

in vec3 cameraFront;
//Point of Light
vec3 lightPos = vec3(0.0,100.0,0.0);

void main()
{
    gl_Position = projection * view * model * vec4(position, 1.0);
    TexCoords = texCoords;
	normalText= normal;
	positionPoint=position;
	
	
	vs_out.FragPos   = vec3(model * vec4(position, 1.0));   
    vs_out.TexCoords = texCoords;    
    
    vec3 T   = normalize(mat3(model) * tangent);
    vec3 B   = normalize(mat3(model) * bitangent);
    vec3 N   = normalize(mat3(model) * normal);
    
	TBN = transpose(mat3(T, B, N));
    vs_out.TangentLightPos = TBN * lightPos;
    vs_out.TangentViewPos  = TBN * cameraFront;
    vs_out.TangentFragPos  = TBN * vec3(model * vec4(position, 0.0));
}