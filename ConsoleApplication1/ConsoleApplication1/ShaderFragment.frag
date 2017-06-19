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
uniform vec3 cameraPosition;
in vec3 n;

vec2 ParallaxMapping(vec2 texCoords, vec3 viewDir)
{ 
    float height =  texture(depthMap, texCoords).r;     
    return texCoords - viewDir.xy / viewDir.z * (height * height_scale);            
}
float Ia=0.5;
float Ka=0.5;
float Il=1.0;
float Kd=0.3;
float Ke=0.2;

//Point of Light
vec3 point = vec3(0.0,100.0,0.0);

//L vector
vec3 l=normalize(normalize(-vec3(0.0,-1.0,-1.0)));

//V vector
vec3 v=normalize(cameraPosition-positionPoint);

vec4 Ambient(vec2 tCoord)
{
	return vec4(texture(diffuseMap, tCoord))*Ia*Ka;
}
vec4 Diffuse(vec2 tCoord)
{
	return vec4(texture(diffuseMap, tCoord))*Il*Kd*max(dot(l,n),0.0);
}

vec4 Specular(vec2 tCoord)
{
	vec3 h=(l+v)/2.0;
	vec3 r=2*dot(l,n)*n-l;
	float esp= max(dot(r,v),0);
	
	return vec4(texture(diffuseMap, tCoord))*Il*Ke*esp;
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
    /*float d=length(l);
	float fatt = 1.0/(1.0+0.7*d+1.8*(d*d));
    if(active)
	{
        texCoords = ParallaxMapping(fs_in.TexCoords,  viewDir);
	}
	//FragColor=(Ambient(texCoords)+Diffuse(texCoords)+Specular(texCoords));//*fatt;
    FragColor=texture(diffuseMap,texCoords);*/
    vec4 dir=Ambient(texCoords)+Diffuse(texCoords)+Specular(texCoords);
        
    //PointLight
    Il=1.0;
    l=normalize(point-positionPoint);
    float d=length(l);
    float fatt = 1.0/(1.0+0.7*d+1.8*(d*d));
    vec4 p=(Ambient(texCoords)+Diffuse(texCoords)+Specular(texCoords))*fatt;
    
    //Focus
    vec3 focDir=vec3(0.0,-1.0,0.0);
    l=normalize(point-positionPoint);
    float rMin=10.0;
    float rMax=50.0;
    float theta=dot(l,normalize(-focDir));
    float epsilon= rMin-rMax;
    float inte= clamp((theta-rMax)/epsilon,0,1);
    vec4 f;
    Ka=0.3;
    if(theta>cos(rMax))
    {
        f=(Ambient(texCoords)+Diffuse(texCoords)+Specular(texCoords))*fatt*inte;
    }
    else
    {       
        f=Ambient(texCoords);
    }
    p*=vec4(0.0,1.0,0.0,0.0);
    FragColor= f+dir+p;
}