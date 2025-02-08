export const vertexShaderSrc = `      
  attribute vec3 a_position;
 
  uniform mat3 u_matrix;
 
  void main() {
    gl_PointSize = 3.0;
    gl_Position = vec4((u_matrix * a_position), 1);
  }
`;