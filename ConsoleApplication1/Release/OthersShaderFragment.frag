#version 330 core

in vec2 TexCoords;
in vec3 normalText;
in vec3 positionPoint;
in vec3 cameraFront;

out vec4 color;

uniform sampler2D texture_diffuse1;
uniform sampler2D normalMap;
uniform sampler2D depthMap;
uniform bool ambient;
uniform bool pointLight;
uniform bool cone;
void main()
{
	//----- Ambient ------///
	//NormalMapp
	vec3 n=normalText;//texture(normalMap, TexCoords);
	
	//Ambient Specular, Difuse and Shinness
	float a=0.1;
	float s=0.1;
	float d=0.1;
	float q=1.0;
	
	//Intensiti of the light
	float omega=0.001;
	
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
	vec4 ambientContribution=vec4(texture(texture_diffuse1,TexCoords))*light;//vec4(0.4)*light;
	
	//------- PointLight -------//
	//Ambient Specular, Difuse and Shinness
	a=0.5;
	s=0.5;
	d=0.5;
	q=1.0;
	
	//Intensiti of the light
	omega=0.005;
	
	//Point of Light
	point = vec3(-30.0,10.0,-10.0);
	
	//L vector
	l=normalize(point-positionPoint);
	
	//Distance surface to point
	distance= length(point-positionPoint);
	
	//R vector
	r= (2*dot(l,n)*n)-l;
	
	//V vector
	v=-cameraFront;
	
	light= a+((d*dot(n,l))+(s*pow(dot(v,r),q)))*(omega/4*3.1415*(distance*distance));
	float fatt=1/(1.0+0.35*distance+0.44*distance);
	
	vec4 pointContribution=vec4(texture(texture_diffuse1, TexCoords));
	//pointContribution+=0.5;
	pointContribution*=(light*fatt);
	
	//--- Foco ---///
	vec3 focoDir= vec3(1.0,0.0,0.0);
	//No sabemos porque, pero por mucho que se cambie el focoDir, el dot = 0;
	
	float theta=2.0;//dot(l,normalize(-focoDir));
	float aperturaMin=1.0;
	float aperturaMax=5.0;
	float epsi=aperturaMin-aperturaMax;
	float inte=clamp((theta-aperturaMax)/epsi,0.0,1.0);
	vec4 coneContribution=vec4(texture(texture_diffuse1, TexCoords));
	//coneContribution+=0.5;
	coneContribution*=(light*fatt*inte);
	if(ambient)
	{		
		color=ambientContribution;
	}
	else if(pointLight)
	{		
		color=pointContribution;
	}
	else if(cone)
	{
		color=coneContribution;
		//color=vec4(inte);
	}
}

