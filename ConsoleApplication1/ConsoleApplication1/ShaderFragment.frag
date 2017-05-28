#version 330 core

in vec2 TexCoords;
in vec3 normalText;
in vec3 positionPoint;
in vec3 cameraFront;
in mat3 TBN;
in mat3 transTBN;

out vec4 color;

uniform sampler2D texture_diffuse1;
uniform sampler2D normalMap;
uniform sampler2D depthMap;

in VS_OUT {
    vec3 FragPos;
    vec2 TexCoords;
    vec3 TangentLightPos;
    vec3 TangentViewPos;
    vec3 TangentFragPos;
} fs_in;

float height_scale=20.0;

vec2 ParallaxMapping(vec2 texCoords, vec3 viewDir)
{ 
    float height =  texture(depthMap, TexCoords).r;    
    vec2 p = viewDir.xy / viewDir.z * (height * height_scale);
    return texCoords - p;    
} 

void main()
{
	// Offset texture coordinates with Parallax Mapping
    vec3 viewDir   = normalize(fs_in.TangentViewPos - fs_in.TangentFragPos);
    vec2 texCoords = ParallaxMapping(TexCoords,  cameraFront);

    // then sample textures with new texture coords
    vec3 diffuse = texture(texture_diffuse1, texCoords).rgb;
    vec3 normal  = texture(normalMap, texCoords).rgb;
    normal = normalize(normal * 2.0 - 1.0);
	
	//NormalMapp
	vec3 n=vec4(texture(normalMap, TexCoords)).xyz;
	n = normalize(n * 4.0 - 1.0);   
	//n = normalize(TBN * n);
	
	//Ambient Specular, Difuse and Shinness
	float a=0.5;
	float s=0.1;
	float d=0.1;
	float q=1.0;
	
	//Intensiti of the light
	float omega=0.005;
	
	//Point of Light
	vec3 point = vec3(0.0,100.0,0.0);
	
	//L vector
	vec3 l=normalize(point-positionPoint);
	
	//Distance surface to point
	float distance= length(point-positionPoint);
	
	//R vector
	vec3 r= (2*dot(l,n)*n)-l;
	
	//V vector
	vec3 v=-cameraFront;
	
	float light= a+((d*dot(n,l))+(s*pow(dot(v,r),q)))*(omega/4*3.1415*(distance*distance));

	color = vec4(texture(texture_diffuse1, TexCoords)) * light;
}

