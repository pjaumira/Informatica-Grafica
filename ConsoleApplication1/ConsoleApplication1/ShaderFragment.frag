#version 330 core

in vec2 TexCoords;
in vec3 normalText;
in vec3 positionPoint;
in vec3 cameraFront;

out vec4 color;

uniform sampler2D texture_diffuse1;

void main()
{
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
	vec3 r= (2*dot(l,normalText)*normalText)-l;
	
	//V vector
	vec3 v=-cameraFront;
	
	float light= a+((d*dot(normalText,l))+(s*pow(dot(v,r),q)))*(omega/4*3.1415*(distance*distance));

	color = vec4(texture(texture_diffuse1, TexCoords))*light;
    
}