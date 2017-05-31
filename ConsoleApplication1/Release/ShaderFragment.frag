#version 330 core
out vec4 FragColor;

in VS_OUT {
    vec3 FragPos;
    vec2 TexCoords;
    vec3 TangentLightPos;
    vec3 TangentViewPos;
    vec3 TangentFragPos;
} fs_in;

uniform sampler2D diffuseMap;
uniform sampler2D normalMap;
uniform sampler2D depthMap;

uniform bool active;
uniform float height_scale;

in vec3 positionPoint;
in vec3 cameraFront;
in vec3 n;

vec2 ParallaxMapping(vec2 texCoords, vec3 viewDir)
{ 
    float height =  texture(depthMap, texCoords).r;     
    return texCoords - viewDir.xy / viewDir.z * (height * height_scale);            
}

void main()
{           
    // Offset texture coordinates with Parallax Mapping
    vec3 viewDir = normalize(fs_in.TangentViewPos - fs_in.TangentFragPos);
    vec2 texCoords = fs_in.TexCoords;
    if(active)
	{
        texCoords = ParallaxMapping(fs_in.TexCoords,  viewDir);
	}
    	
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

	FragColor = vec4(texture(diffuseMap, texCoords))* light;
}