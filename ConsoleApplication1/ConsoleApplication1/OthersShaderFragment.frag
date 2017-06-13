#version 330 core

in vec2 TexCoords;
in vec3 normalText;
in vec3 positionPoint;
uniform vec3 cameraPosition;
uniform vec3 cameraFront;

out vec4 color;

uniform sampler2D texture_diffuse1;
uniform sampler2D normalMap;
uniform sampler2D depthMap;

uniform bool ambient;
uniform bool pointLight;
uniform bool cone;

float Ia=0.2;
float Ka=0.5;
float Il=0.7;
float Kd=0.3;
float Ke=0.2;

//Directional Light
vec3 directional = vec3(0.0,100.0,0.0);
vec3 point = vec3(0.0,50.0,0.0);

//L vector
vec3 lDir= vec3 (1.0,-1.0,0.0);
vec3 l=normalize(-lDir);

//V vector
vec3 v=normalize(cameraPosition-positionPoint);

vec4 Ambient()
{
	//return vec4(1.0)*Ia*Ka;
	return vec4(texture(texture_diffuse1, TexCoords))*Ia*Ka;
}
vec4 Diffuse()
{
	//return vec4(1.0)*Il*Kd*max(dot(l,normalText),0.0);
	return vec4(texture(texture_diffuse1, TexCoords))*Il*Kd*max(dot(l,normalText),0.0);
}

vec4 Specular()
{
	vec3 h=(l+v)/2.0;
	vec3 r=2*dot(l,normalText)*normalText-l;
	float esp= max(dot(r,v),0);
	//return vec4(1.0)*Il*Ke*esp;
	return vec4(texture(texture_diffuse1, TexCoords))*Il*Ke*esp;
}
void main()
{
	vec4 dir=Ambient()+Diffuse()+Specular();
		
	//PointLight
	l=normalize(point-positionPoint);
	float d=length(l);
	float fatt = 1.0/(1.0+0.7*d+1.8*(d*d));
	vec4 p=(Ambient()+Diffuse()+Specular())*fatt;
	
	//Focus
	vec3 focDir=vec3(0.0,-1.0,0.0);
	l=normalize(point-positionPoint);
	Il=1.0;
	Ka=0.3;
	float rMin=10.0;
	float rMax=50.0;
	float theta=dot(l,normalize(-focDir));
	float epsilon= rMin-rMax;
	float inte= clamp((theta-rMax)/epsilon,0,1);
	vec4 f=(Ambient()+Diffuse()+Specular())*fatt*inte;
	if(ambient)
	{
		color=dir;
	}
	else if(pointLight)
	{
		color=p;
	}
	else if(cone)
	{
		if(theta>cos(rMax))
		{
			color=f;
		}
		else
		{		
			color=Ambient();
		}
	}
}

