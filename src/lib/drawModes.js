export const drawModes = () => {
    return {
        points: window['glContext'].POINTS,
        lines: window['glContext'].LINES,
        lstrip: window['glContext'].LINE_STRIP,
        lloop: window['glContext'].LINE_LOOP,
        triangles: window['glContext'].TRIANGLES,
        tstrip: window['glContext'].TRIANGLE_STRIP,
        tfan: window['glContext'].TRIANGLE_FAN,
    };
};