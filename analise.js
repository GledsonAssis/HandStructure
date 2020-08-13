var num_no =1, num_barra=0, num_apoio=0, type_mouse = 1, SIGMA_X = 0, SIGMA_Y = 0, zIn = 1, old_x, old_y, z_old, dX = 0, dY = 0, dz=0, A = [0,0,0,0,0,0], B = [0,0,0], C = [0,0,0,0];
var force=[], matrizLocal=[], matrizGlobal=[], matrizTotal=[], matriz_x=[], apoio_status=[], desloc_vetor = [], reacoes_result =[], test = 0, normal_result=[], cortant_result=[], momento_result=[];
var maximo_normal = 0;
var maximo_cortante = 0;
var maximo_momento = 0;
var maximo_deform = 0;
// -- colors -- //
    var color_text='#ffe500';
    var color_barra='#ffffff';
    var color_back='#101010';
    var color_node='#00ffff';
    var color_carga='#314389';
    var color_diagrams = '#1e1e1e';
// --- Imagens --- //
    var rotula = document.createElement("IMG");
    rotula.src = "images/img/Apoios/rotula.png";
    rotula.onload = draw_apoio;
    var pino = document.createElement("IMG");
    pino.src = "images/img/Apoios/pino.png";
    pino.onload = draw_apoio;
    var engaste = document.createElement("IMG");
    engaste.src = "images/img/Apoios/engaste.png";
    engaste.onload = draw_apoio;
    var rolete_x = document.createElement("IMG");
    rolete_x.src = "images/img/Apoios/rolete_x.png";
    rolete_x.onload = draw_apoio;
    var rolete_y = document.createElement("IMG");
    rolete_y.src = "images/img/Apoios/rolete_y.png";
    rolete_y.onload = draw_apoio;
    var Engaste_rolete_x = document.createElement("IMG");
    Engaste_rolete_x.src = "images/img/Apoios/Engaste-rolete_x.png";
    Engaste_rolete_x.onload = draw_apoio;
    var Engaste_rolete_y = document.createElement("IMG");
    Engaste_rolete_y.src = "images/img/Apoios/Engaste-rolete_y.png";
    Engaste_rolete_y.onload = draw_apoio;
    var Placa = document.createElement("IMG");
    Placa.src = "images/img/Apoios/Placa.png";
    Placa.onload = draw_apoio;
    var Desloc_x = document.createElement("IMG");
    Desloc_x.src = "images/img/Apoios/Desloc_x.png";
    Desloc_x.onload = draw_apoio;
    var Desloc_y = document.createElement("IMG");
    Desloc_y.src = "images/img/Apoios/Desloc_y.png";
    Desloc_y.onload = draw_apoio;
    var Desloc_rot = document.createElement("IMG");
    Desloc_rot.src = "images/img/Apoios/Desloc_rot.png";
    Desloc_rot.onload = draw_apoio;
    var Spring_x = document.createElement("IMG");
    Spring_x.src = "images/img/Apoios/mola_x.png";
    Spring_x.onload = draw_apoio;
    var Spring_y = document.createElement("IMG");
    Spring_y.src = "images/img/Apoios/mola_y.png";
    Spring_y.onload = draw_apoio;
    var Spring_rot = document.createElement("IMG");
    Spring_rot.src = "images/img/Apoios/mola_rot.png";
    Spring_rot.onload = draw_apoio;
    var Force_x = document.createElement("IMG");
    Force_x.src = "images/img/Forces/force_x.png";
    Force_x.onload = draw_force;
    var Force_y = document.createElement("IMG");
    Force_y.src = "images/img/Forces/force_y.png";
    Force_y.onload = draw_force;
    var Force_rot = document.createElement("IMG");
    Force_rot.src = "images/img/Forces/force_rot.png";
    Force_rot.onload = draw_force;

function threme() {
    op = document.getElementById("threme").value;
    if (op === "Dark"){
        color_barra='#ffffff';
        color_text='#ffe500';
        color_node='#00ffff';
        color_back='#101010';
        color_carga='#314389';
        color_diagrams = '#1e1e1e';
    }
    else{
        color_barra='#000000';
        color_text='#0c18ff';
        color_node='#ff0008';
        color_back='#fafafa';
        color_carga='#d2d2d2';
        color_diagrams = '#e6e6e6';
    }
    document.getElementById('canvas').style.background=color_back;
}
function draw() {
    /*============= Creating a canvas ======================*/
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 2048;
    canvas.height = 940;

    /*================= Mouse events ======================*/
    var drag = false;
    var mouseDown = function(e) {
        drag = true;
        if (type_mouse===1){
            document.getElementById('canvas').style.cursor="move";
            old_x = canvas.clientWidth/2-e.layerX;
            old_y = canvas.clientHeight/2-e.layerY;
            z_old = canvas.clientHeight/2-e.layerY;
        }
        else{z_old=canvas.clientHeight/2-e.layerY}
        e.preventDefault();
        return false;
    };
    var mouseUp = function(){
        drag = false;
        document.getElementById('canvas').style.cursor="crosshair";
    };
    var mouseMove = function(e) {
        if (!drag) return false;
        if (type_mouse===1){
            dX = ((-((canvas.clientWidth/2-e.layerX)*(canvas.width/canvas.clientWidth)))+old_x*(canvas.width/canvas.clientWidth))*zIn;
            dY = ((-(canvas.clientHeight/2-e.layerY)*(canvas.height/canvas.clientHeight))+old_y*(canvas.height/canvas.clientHeight))*zIn;
            SIGMA_X += dX;
            SIGMA_Y += dY;
            old_x = canvas.clientWidth/2-e.layerX; old_y = canvas.clientHeight/2-e.layerY;
        }
        else{
            dz=((-(canvas.clientHeight/2-e.layerY)*(canvas.height/canvas.clientHeight))+z_old*(canvas.height/canvas.clientHeight))/1024;
            if (dz<0){document.getElementById('canvas').style.cursor="zoom-in"}
            else{document.getElementById('canvas').style.cursor="zoom-out"}
            z_old = canvas.clientHeight/2-e.layerY;
            zIn += dz;
            if (zIn<0.05){zIn = 0.05}
        }
        e.preventDefault();
    };
    var zoomIn = function (e) {
        zIn -= e.wheelDelta/12000;
        if (zIn<0.05){zIn = 0.05}
        e.preventDefault();
    };
    function sketchpad_touchStart() {
        if (type_mouse===1) {
            old_x = canvas.clientWidth / 2 - event.touches[0].pageX;
            old_y = canvas.clientHeight / 2 - event.touches[0].pageY;
            z_old = canvas.clientHeight / 2 - event.touches[0].pageY;
        }
        else{z_old=canvas.clientHeight / 2 - event.touches[0].pageY}
        event.preventDefault();
        return false;
    }
    function sketchpad_touchMove(e) {
        // Update the touch co-ordinates
        getTouchPos(e);
        // Prevent a scrolling action as a result of this touchmove triggering.
        event.preventDefault();
    }
    function getTouchPos(e) {
        if (!e)
            var e = event;
        if(e.touches) {
            if (e.touches.length === 1) { // Only deal with one finger
                if (type_mouse===1){
                    var touch = e.touches[0]; // Get the information for finger #1
                    dX = ((-((canvas.clientWidth/2-touch.pageX)*(canvas.width/canvas.clientWidth)))+old_x*(canvas.width/canvas.clientWidth))*zIn;
                    dY = ((-(canvas.clientHeight/2-touch.pageY)*(canvas.height/canvas.clientHeight))+old_y*(canvas.height/canvas.clientHeight))*zIn;
                    SIGMA_X += dX;
                    SIGMA_Y += dY;
                    old_x = canvas.clientWidth/2-event.touches[0].pageX; old_y = canvas.clientHeight/2-event.touches[0].pageY;
                }
                else{
                    dz=((-(canvas.clientHeight/2-event.touches[0].pageY)*(canvas.height/canvas.clientHeight))+z_old*(canvas.height/canvas.clientHeight))/1024;
                    z_old = canvas.clientHeight/2-event.touches[0].pageY;
                    zIn += dz;
                    if (zIn<0.05){zIn = 0.05}
                }
            }
        }
    }

    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("touchstart",sketchpad_touchStart,false);
    canvas.addEventListener("mouseup", mouseUp, false);
    canvas.addEventListener("mouseout", mouseUp, false);
    canvas.addEventListener("mousemove", mouseMove, false);
    canvas.addEventListener("touchmove", sketchpad_touchMove, false);
    canvas.addEventListener("wheel", zoomIn, false);

    var button = document.getElementById('btn-download');
    button.addEventListener('click', function (e) {
            button.href = canvas.toDataURL();
            button.download = "myStructure.png";
    });
    /*=================== Drawing =================== */
    var time_old = 0;
    ctx.translate(canvas.width/2, canvas.height/2);
    var animate = function(time) {
        time_old = time;
        ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
        if (document.getElementById("menu_2").style.display === "block"){
            draw_barra();
            if (document.getElementById("Normais").style.display === "block"){
                diagram_normal();
            }
            if (document.getElementById("Cortantes").style.display === "block"){
                diagram_cortan();
            }
            if (document.getElementById("Momentos").style.display === "block"){
                diagram_moment();
            }
            if (document.getElementById("Deformacoes").style.display === "block"){
                deformation();
            }
            draw_no();
        }else {
            draw_carga();
            draw_barra();
            draw_apoio();
            draw_force();
            draw_no();
        }
        window.requestAnimationFrame(animate);
    };
    animate(0);
}
function edit_row_no(no) {
    document.getElementById("edit_button"+no).style.display="none";
    document.getElementById("save_button"+no).style.display="block";

    var x_coor=document.getElementById("x_"+no);
    var y_coor=document.getElementById("y_"+no);

    var x_data=x_coor.innerHTML;
    var y_data=y_coor.innerHTML;

    x_coor.innerHTML="<input style='width:100%;height:22px' type='number' id='x_text"+no+"' value='"+x_data+"'>";
    y_coor.innerHTML="<input style='width:100%;height:22px' type='number' id='y_text"+no+"' value='"+y_data+"'>";
}
function save_row_no(no) {
    var table = document.getElementById("data_table_no");
    var x_val=document.getElementById("x_text"+no).value;
    var y_val=document.getElementById("y_text"+no).value;
    document.getElementById("x_"+no).innerHTML=x_val;
    document.getElementById("y_"+no).innerHTML=y_val;
    document.getElementById("edit_button"+no).style.display="block";
    document.getElementById("save_button"+no).style.display="none";
    draw();
}
function delete_row_no(no) {
    document.getElementById("row"+no+"").outerHTML="";
    document.getElementById("barra_inicio"+no+"").outerHTML="";
    document.getElementById("barra_fim"+no+"").outerHTML="";
    document.getElementById("apoio"+no+"").outerHTML="";
    document.getElementById("no_force"+no+"").outerHTML="";

    var table = document.getElementById("data_table_barra");
    var table_len = (table.rows.length)-2;
    if(table_len>0){
        for (p=(table_len+1);p>0;p--) {
            var x = document.getElementById("data_table_barra").rows[p].cells;
            if(x[1].innerHTML === ""+no+""){
                document.getElementById("row_barra"+x[0].innerHTML+"").outerHTML="";
            }else if(x[2].innerHTML === ""+no+""){
                document.getElementById("row_barra"+x[0].innerHTML+"").outerHTML="";
            }
        }
    }
    draw();
}
function add_row_no() {
    document.getElementById("new_x").style.border = '1px solid #a9a9a9';
    document.getElementById("new_y").style.border = '1px solid #a9a9a9';
    var new_x=document.getElementById("new_x").value;
    var new_y=document.getElementById("new_y").value;
    if ((new_x !== "")&&(new_y !== "")) {
        num_no +=1;
        var new_name=num_no;
        var table = document.getElementById("data_table_no");
        var table_len = (table.rows.length) - 1;
        table.insertRow(table_len).outerHTML = "<tr id='row" + num_no + "'>" +
            "<td class='text-center' id='No" + num_no + "'>" + new_name + "</td>" +
            "<td class='text-center' id='x_" + num_no + "'>" + new_x + "</td>" +
            "<td class='text-center' id='y_" + num_no + "'>" + new_y + "</td>" +
            "<td class='text-center'><input id='rot"+num_no+"' type='checkbox' value disabled></td>" +
            "<td><div class='btn-group'>" +
            "   <button type='button' id='edit_button" + num_no + "' class='btn btn-primary btn-xs' onclick='edit_row_no(" + num_no + ")'><i class='fa fa-pencil'></i></button>" +
            "   <button type='button' style='display: none; border-bottom-left-radius: 4px; border-top-left-radius: 4px' id='save_button" + num_no + "' class='btn btn-success btn-xs' onclick='save_row_no(" + num_no + ")'><i class='fa fa-check'></i></button>" +
            "   <button type='button' class='btn btn-xs btn-danger' onclick='delete_row_no(" + num_no + ")'><i class='fa fa-trash-o'></i></button>" +
            "</div></td></tr>";
        document.getElementById("new_x").value = "";
        document.getElementById("new_y").value = "";

        var x = document.getElementById("new_inicio");
        var opx = document.createElement("option");
        opx.text = num_no;
        opx.id = 'barra_inicio' + num_no;
        x.add(opx, x[num_no]);

        var y = document.getElementById("new_fim");
        var opy = document.createElement("option");
        opy.text = num_no;
        opy.id = 'barra_fim' + num_no;
        y.add(opy, y[num_no]);

        var ap = document.getElementById("select_no");
        var apoio=document.createElement("option");
        apoio.text=num_no;
        apoio.id='apoio'+num_no;
        ap.add(apoio, ap[num_no]);

        var force = document.getElementById("no_force");
        var forc = document.createElement("option");
        forc.text=num_no;
        forc.id='no_force'+num_no;
        force.add(forc, force[num_no]);
        draw();
    } else {
        document.getElementById("new_x").style.border = '1px solid #ed5565';
        document.getElementById("new_y").style.border = '1px solid #ed5565';
    }
}
function edit_row_barra(no) {
    document.getElementById("edit_button_barra"+no).style.display="none";
    document.getElementById("save_button_barra"+no).style.display="block";

    var x_coor=document.getElementById("inicio_"+no);
    var y_coor=document.getElementById("fim_"+no);

    var x_data=x_coor.innerHTML;
    var y_data=y_coor.innerHTML;

    x_coor.innerHTML="<input style='width: 100%;  height: 22px' type='number' id='bar_i"+no+"' value='"+x_data+"'>";
    y_coor.innerHTML="<input style='width: 100%;  height: 22px' type='number' id='bar_f"+no+"' value='"+y_data+"'>";
}
function save_row_barra(no) {
    var x_val=document.getElementById("bar_i"+no).value;
    var y_val=document.getElementById("bar_f"+no).value;

    document.getElementById("inicio_"+no).innerHTML=x_val;
    document.getElementById("fim_"+no).innerHTML=y_val;

    document.getElementById("edit_button_barra"+no).style.display="block";
    document.getElementById("save_button_barra"+no).style.display="none";
    draw();
}
function delete_row_barra(no) {
    document.getElementById("row_barra"+no+"").outerHTML="";
    document.getElementById("barra_force"+no+"").outerHTML="";
    document.getElementById("barra_secao"+no+"").outerHTML="";
    document.getElementById("bar_prop"+no+"").outerHTML="";
    document.getElementById("barra_material"+no+"").outerHTML="";
    document.getElementById("bar_mat"+no+"").outerHTML="";
    draw();
}
function add_row_barra() {
    document.getElementById("new_inicio").style.border = '1px solid #a9a9a9';
    document.getElementById("new_fim").style.border = '1px solid #a9a9a9';
    var new_x=document.getElementById("new_inicio").value;
    var new_y=document.getElementById("new_fim").value;
    if ((new_x!=="")&&(new_y!=="")&&(new_x!==new_y)) {
        num_barra += 1;
        var table = document.getElementById("data_table_barra");
        var table_len = (table.rows.length) - 1;
        table.insertRow(table_len).outerHTML = "<tr id='row_barra" + num_barra + "'>" +
            "<td class='text-center' id='barra" + num_barra + "'>" + num_barra + "</td>" +
            "<td class='text-center' id='inicio_" + num_barra + "'>" + new_x + "</td>" +
            "<td class='text-center' id='fim_" + num_barra + "'>" + new_y + "</td>" +
            "<td><div class='btn-group'>" +
            "   <button  type='button' id='edit_button_barra" + num_barra + "' class='btn btn-primary btn-xs' onclick='edit_row_barra(" + num_barra + ")'><i class='fa fa-pencil'></i></button>" +
            "   <button type='button' style='display: none; border-bottom-left-radius: 4px; border-top-left-radius: 4px' id='save_button_barra" + num_barra + "' class='btn btn-success btn-xs' onclick='save_row_barra(" + num_barra + ")'><i class='fa fa-check'></i></button>" +
            "   <button type='button' class='btn btn-xs btn-danger' onclick='delete_row_barra(" + num_barra + ")'><i class='fa fa-trash-o'></i></button>" +
            "</div></td></tr>";
        document.getElementById("new_inicio").value = "";
        document.getElementById("new_fim").value = "";
        var table2 = document.getElementById("data_bars_prop");
        var table_len2 = (table2.rows.length);
        table2.insertRow(table_len2).outerHTML = "<tr id='bar_prop"+num_barra+"'>"+
            "<td class='text-center'>"+num_barra+"</td>"+
            "<td class='text-center' id='A_barra"+num_barra+"'></td>"+
            "<td class='text-center' id='I_barra"+num_barra+"'></td>";

        var table3 = document.getElementById("data_bars_material");
        var table_len3 = (table3.rows.length);
        table3.insertRow(table_len3).outerHTML = "<tr id='bar_mat"+num_barra+"'>"+
            "<td class='text-center'>"+num_barra+"</td>"+
            "<td class='text-center' id='Elast"+num_barra+"'></td>"+
            "<td class='text-center' id='poisson"+num_barra+"'></td>";

        var bar = document.getElementById("barra_force");
        var barr = document.createElement("option");
        barr.text=num_barra;
        barr.id="barra_force"+num_barra;
        bar.add(barr,bar[num_barra]);

        var sec = document.getElementById("secao_barra");
        var secao = document.createElement("option");
        secao.text=num_barra;
        secao.id="barra_secao"+num_barra;
        sec.add(secao,sec[num_barra]);

        var mat = document.getElementById("material_barra");
        var mate = document.createElement("option");
        mate.text=num_barra;
        mate.id="barra_material"+num_barra;
        mat.add(mate,mat[num_barra]);
        draw();
    }
    else {
        document.getElementById("new_inicio").style.border = '1px solid #ed5565';
        document.getElementById("new_fim").style.border = '1px solid #ed5565';}
}
function delete_row_apoio(no) {
    document.getElementById("row_apoio"+no+"").outerHTML="";
    document.getElementById("apoio"+no+"").style.display='block';
    draw();
}
function add_row_apoio() {
    document.getElementById("select_no").style.border='1px solid #a9a9a9';
    var new_x=document.getElementById("select_no").value;
    if((document.getElementById("menu_rigido").style.display)==='block'){
        var new_y='Rígido';
    }else{new_y='Flexível'}

    if((new_x!=="")){
        A = [];
        if(document.getElementById("rigido_x").checked === true){A.push(1)}else{A.push(0)}
        if(document.getElementById("rigido_y").checked === true){A.push(1)}else{A.push(0)}
        if(document.getElementById("rigido_rot").checked === true){A.push(1)}else{A.push(0)}
        if(document.getElementById("status_Dx").checked === true && document.getElementById('valor_Dx').value !== ""){A.push(document.getElementById('valor_Dx').value)}else{A.push(0)}
        if(document.getElementById("status_Dy").checked === true && document.getElementById('valor_Dy').value !== ""){A.push(document.getElementById('valor_Dy').value)}else{A.push(0)}
        if(document.getElementById("status_Rz").checked === true && document.getElementById('valor_Rz').value !== ""){A.push(document.getElementById('valor_Rz').value)}else{A.push(0)}
        if(document.getElementById("status_Kx").checked === true && document.getElementById('valor_Kx').value !== ""){A.push(document.getElementById('valor_Kx').value)}else{A.push(0)}
        if(document.getElementById("status_Ky").checked === true && document.getElementById('valor_Ky').value !== ""){A.push(document.getElementById('valor_Ky').value)}else{A.push(0)}
        if(document.getElementById("status_Kz").checked === true && document.getElementById('valor_Kz').value !== ""){A.push(document.getElementById('valor_Kz').value)}else{A.push(0)}
        num_apoio=new_x;
        var table = document.getElementById("data_table_apoio");
        var table_len = (table.rows.length);
        table.insertRow(table_len).outerHTML = "<tr id='row_apoio"+num_apoio+"' value="+A+">" +
            "<td class='text-center' id='no_apoio"+num_apoio+"'>"+new_x+"</td>"+
            "<td class='text-center'>"+new_y+"</td>"+
            "<td><button  type='button' class='btn btn-xs btn-danger' style='width:40px' onclick='delete_row_apoio("+num_apoio+")'><i class='fa fa-trash-o'></i></button>"+
            "</td></tr>";
        document.getElementById("apoio"+new_x+"").style.display='none';
    }
    else{document.getElementById("select_no").style.border='1px solid #ed5565'}
    document.getElementById('select_no').value = "";
}
function delete_row_carga_no(no){
    document.getElementById("row_no_carga"+no+"").outerHTML="";
    document.getElementById("no_force"+no+"").style.display='block';
    draw();
}
function delete_row_carga_dist(no){
    document.getElementById("row_dist_carga"+no+"").outerHTML="";
    document.getElementById("barra_force"+no+"").style.display='block';
    draw();
}
function add_row_no_carga() {
    B = [];
    document.getElementById("no_force").style.border='1px solid "a9a9a9';
    var new_no_carga = document.getElementById("no_force").value;
    if ((new_no_carga!=="")&&((document.getElementById('value_Fx').value)!==""||(document.getElementById('value_Fy').value)!==""||(document.getElementById('value_Mz').value)!=="")){
        if(document.getElementById('value_Fx').value !== ""){B.push(document.getElementById('value_Fx').value)}else{B.push(0)}
        if(document.getElementById('value_Fy').value !== ""){B.push(document.getElementById('value_Fy').value)}else{B.push(0)}
        if(document.getElementById('value_Mz').value !== ""){B.push(document.getElementById('value_Mz').value)}else{B.push(0)}

        var table = document.getElementById("data_table_carga");
        var table_len = (table.rows.length);
        table.insertRow(table_len).outerHTML = "<tr id='row_no_carga"+new_no_carga+"' value="+B+">"+
            "<td class='text-center' id='no_carga"+new_no_carga+"'>Nó "+new_no_carga+"</td>"+
            "<td class='text-center'>Nodal</td>"+
            "<td><button  type='button' class='btn btn-xs btn-danger' style='width: 40px' onclick='delete_row_carga_no("+new_no_carga+")'><i class='fa fa-trash-o'></i></button>"+
            "</td></tr>";
        document.getElementById("no_force"+new_no_carga+"").style.display='none';
        document.getElementById("no_force").value="";
    }else{document.getElementById("no_force").style.border='1px solid #ed5565'}
}
function add_row_barra_carga() {
    C=[];
    document.getElementById("barra_force").style.border='1px solid "a9a9a9';
    var new_no_carga = document.getElementById("barra_force").value;
    if ((new_no_carga!=="")&&((document.getElementById('value_qxi').value)!==""||(document.getElementById('value_qyi').value)!==""||(document.getElementById('value_qyf').value)!=="")){
        if(document.getElementById('value_qxi').value !== ""){C.push(document.getElementById('value_qxi').value)}else{C.push(0)}
        if(document.getElementById('value_qxi').value !== ""){C.push(document.getElementById('value_qxi').value)}else{C.push(0)}
        if(document.getElementById('value_qyi').value !== ""){C.push(document.getElementById('value_qyi').value)}else{C.push(0)}
        if(document.getElementById('value_qyf').value !== ""){C.push(document.getElementById('value_qyf').value)}else{C.push(0)}

        var table = document.getElementById("data_table_carga");
        var table_len = (table.rows.length);
        table.insertRow(table_len).outerHTML = "<tr id='row_dist_carga"+new_no_carga+"' value="+C+">"+
            "<td class='text-center' id='barra_carga"+new_no_carga+"'>Barra "+new_no_carga+"</td>"+
            "<td class='text-center'>Distribuida</td>"+
            "<td><button type='button' class='btn btn-xs btn-danger' style='width: 40px' onclick='delete_row_carga_dist("+new_no_carga+")'><i class='fa fa-trash-o'></i></button>"+
            "</td></tr>";
        document.getElementById("barra_force"+new_no_carga+"").style.display='none';
        document.getElementById("barra_force").value="";
    }else{document.getElementById("barra_force").style.border='1px solid #ed5565'}
}
function add_row_prop_bar() {
    var bar = document.getElementById('secao_barra').value;
    document.getElementById('A_barra'+bar+'').innerHTML = document.getElementById('area').value;
    document.getElementById('I_barra'+bar+'').innerHTML = document.getElementById('inercia').value;
}
function add_prop_all_bar(){
    var table = document.getElementById("data_bars_prop");
    var len_table = table.rows.length;
    for (var i=1;i<len_table;i++){
        var x = table.rows[i].cells;
        x[1].innerHTML = document.getElementById('area').value;
        x[2].innerHTML = document.getElementById('inercia').value;
    }
}
function add_mat_bar() {
    var bar = document.getElementById('material_barra').value;
    document.getElementById('Elast'+bar+'').innerHTML = document.getElementById('elasticidade').value;
    document.getElementById('poisson'+bar+'').innerHTML = document.getElementById('poisson').value;
}
function add_mat_all_bar() {
    var table = document.getElementById("data_bars_material");
    var len_table = table.rows.length;
    for (var i=1;i<len_table;i++){
        var x = table.rows[i].cells;
        x[1].innerHTML = document.getElementById('elasticidade').value;
        x[2].innerHTML = document.getElementById('poisson').value;
    }
}
function btn_move() {
    type_mouse = 1;
    document.getElementById('move').className="btn btn-primary btn-xs";
    document.getElementById('zoom').className="btn btn-default btn-xs";
}
function btn_zoom() {
    type_mouse = 2;
    document.getElementById('move').className="btn btn-default btn-xs";
    document.getElementById('zoom').className="btn btn-primary btn-xs";
}
function nos(){
    document.getElementById("new_no").className="btn btn-primary btn-xs";
    document.getElementById("new_barra").className="btn btn-default btn-xs";
    document.getElementById("new_apoio").className="btn btn-default btn-xs";
    document.getElementById("new_carga").className="btn btn-default btn-xs";
    document.getElementById("secao").className="btn btn-default btn-xs";
    document.getElementById("material").className="btn btn-default btn-xs";
    document.getElementById("nos").style.display="block";
    document.getElementById("barras").style.display="none";
    document.getElementById("apoio").style.display="none";
    document.getElementById("carga").style.display="none";
    document.getElementById("menu_secao").style.display="none";
    document.getElementById("menu_material").style.display="none";
}
function barra(){
    document.getElementById("new_no").className="btn btn-default btn-xs";
    document.getElementById("new_barra").className="btn btn-primary btn-xs";
    document.getElementById("new_apoio").className="btn btn-default btn-xs";
    document.getElementById("new_carga").className="btn btn-default btn-xs";
    document.getElementById("secao").className="btn btn-default btn-xs";
    document.getElementById("material").className="btn btn-default btn-xs";
    document.getElementById("nos").style.display="none";
    document.getElementById("barras").style.display="block";
    document.getElementById("apoio").style.display="none";
    document.getElementById("carga").style.display="none";
    document.getElementById("menu_secao").style.display="none";
    document.getElementById("menu_material").style.display="none";
}
function apoio(){
    document.getElementById("new_no").className="btn btn-default btn-xs";
    document.getElementById("new_barra").className="btn btn-default btn-xs";
    document.getElementById("new_apoio").className="btn btn-primary btn-xs";
    document.getElementById("new_carga").className="btn btn-default btn-xs";
    document.getElementById("secao").className="btn btn-default btn-xs";
    document.getElementById("material").className="btn btn-default btn-xs";
    document.getElementById("nos").style.display="none";
    document.getElementById("barras").style.display="none";
    document.getElementById("apoio").style.display="block";
    document.getElementById("carga").style.display="none";
    document.getElementById("menu_secao").style.display="none";
    document.getElementById("menu_material").style.display="none";
}
function carga(){
    document.getElementById("new_no").className="btn btn-default btn-xs";
    document.getElementById("new_barra").className="btn btn-default btn-xs";
    document.getElementById("new_apoio").className="btn btn-default btn-xs";
    document.getElementById("new_carga").className="btn btn-primary btn-xs";
    document.getElementById("secao").className="btn btn-default btn-xs";
    document.getElementById("material").className="btn btn-default btn-xs";
    document.getElementById("nos").style.display="none";
    document.getElementById("barras").style.display="none";
    document.getElementById("apoio").style.display="none";
    document.getElementById("carga").style.display="block";
    document.getElementById("menu_secao").style.display="none";
    document.getElementById("menu_material").style.display="none";
}
function menu_secao(){
    document.getElementById("new_no").className="btn btn-default btn-xs";
    document.getElementById("new_barra").className="btn btn-default btn-xs";
    document.getElementById("new_apoio").className="btn btn-default btn-xs";
    document.getElementById("new_carga").className="btn btn-default btn-xs";
    document.getElementById("secao").className="btn btn-primary btn-xs";
    document.getElementById("material").className="btn btn-default btn-xs";
    document.getElementById("nos").style.display="none";
    document.getElementById("barras").style.display="none";
    document.getElementById("apoio").style.display="none";
    document.getElementById("carga").style.display="none";
    document.getElementById("menu_secao").style.display="block";
    document.getElementById("menu_material").style.display="none";
}
function materiais(){
    document.getElementById("new_no").className="btn btn-default btn-xs";
    document.getElementById("new_barra").className="btn btn-default btn-xs";
    document.getElementById("new_apoio").className="btn btn-default btn-xs";
    document.getElementById("new_carga").className="btn btn-default btn-xs";
    document.getElementById("secao").className="btn btn-default btn-xs";
    document.getElementById("material").className="btn btn-primary btn-xs";
    document.getElementById("nos").style.display="none";
    document.getElementById("barras").style.display="none";
    document.getElementById("apoio").style.display="none";
    document.getElementById("carga").style.display="none";
    document.getElementById("menu_secao").style.display="none";
    document.getElementById("menu_material").style.display="block";
}
function menu_rigido(){
    document.getElementById("btn_rigido").className="btn btn-primary btn-xs";
    document.getElementById("btn_flexivel").className="btn btn-default btn-xs";
    document.getElementById("menu_rigido").style.display="block";
    document.getElementById("menu_flexivel").style.display="none";
}
function menu_flexivel(){
    document.getElementById("btn_rigido").className="btn btn-default btn-xs";
    document.getElementById("btn_flexivel").className="btn btn-primary btn-xs";
    document.getElementById("menu_rigido").style.display="none";
    document.getElementById("menu_flexivel").style.display="block";
}
function menu_nodal(){
    document.getElementById("btn_nodal").className="btn btn-primary btn-xs";
    document.getElementById("btn_distribuido").className="btn btn-default btn-xs";
    document.getElementById("menu_nodal").style.display="block";
    document.getElementById("menu_distribuido").style.display="none";
}
function menu_distribuido(){
    document.getElementById("btn_nodal").className="btn btn-default btn-xs";
    document.getElementById("btn_distribuido").className="btn btn-primary btn-xs";
    document.getElementById("menu_nodal").style.display="none";
    document.getElementById("menu_distribuido").style.display="block";
}
function secao_change(x) {
    document.getElementById('section_type').style.backgroundImage = 'url("'+x+'")';
    document.getElementById('section_type').style.backgroundSize='contain';
    if(x){
        switch (x){
            case 'images/img/secao_ret.png':
            case 'images/img/secao_tubo.png':
                document.getElementById('d').readOnly = false;
                document.getElementById('d').placeholder = 'cm';
                document.getElementById('b').readOnly = false;
                document.getElementById('b').placeholder = 'cm';
                document.getElementById('tf').readOnly = true;
                document.getElementById('tf').placeholder = '';
                document.getElementById('tw').readOnly = true;
                document.getElementById('tw').placeholder = '';
                document.getElementById('area').readOnly = true;
                document.getElementById('inercia').readOnly = true;
                document.getElementById('inercia').value='';
                document.getElementById('area').value='';
                document.getElementById('tw').value='';
                document.getElementById('tf').value='';
                document.getElementById('b').value='';
                document.getElementById('d').value='';
                break;
            case 'images/img/secao_circ.png':
                document.getElementById('d').readOnly = false;
                document.getElementById('d').placeholder = 'cm';
                document.getElementById('b').readOnly = true;
                document.getElementById('b').placeholder = '';
                document.getElementById('tf').readOnly = true;
                document.getElementById('tf').placeholder = '';
                document.getElementById('tw').readOnly = true;
                document.getElementById('tw').placeholder = '';
                document.getElementById('area').readOnly = true;
                document.getElementById('inercia').readOnly = true;
                document.getElementById('inercia').value='';
                document.getElementById('area').value='';
                document.getElementById('tw').value='';
                document.getElementById('tf').value='';
                document.getElementById('b').value='';
                document.getElementById('d').value='';
                break;
            case 'images/img/secao_generica.png':
                document.getElementById('d').readOnly = true;
                document.getElementById('d').placeholder = '';
                document.getElementById('b').readOnly = true;
                document.getElementById('b').placeholder = '';
                document.getElementById('tf').readOnly = true;
                document.getElementById('tf').placeholder = '';
                document.getElementById('tw').readOnly = true;
                document.getElementById('tw').placeholder = '';
                document.getElementById('area').readOnly = false;
                document.getElementById('inercia').readOnly = false;
                document.getElementById('inercia').value='';
                document.getElementById('area').value='';
                document.getElementById('tw').value='';
                document.getElementById('tf').value='';
                document.getElementById('b').value='';
                document.getElementById('d').value='';
                break;
            default:
                document.getElementById('d').readOnly = false;
                document.getElementById('d').placeholder = 'cm';
                document.getElementById('b').readOnly = false;
                document.getElementById('b').placeholder = 'cm';
                document.getElementById('tf').readOnly = false;
                document.getElementById('tf').placeholder = 'cm';
                document.getElementById('tw').readOnly = false;
                document.getElementById('tw').placeholder = 'cm';
                document.getElementById('area').readOnly = true;
                document.getElementById('inercia').readOnly = true;
                document.getElementById('inercia').value='';
                document.getElementById('area').value='';
                document.getElementById('tw').value='';
                document.getElementById('tf').value='';
                document.getElementById('b').value='';
                document.getElementById('d').value='';
                break;
        }
    }
}
function menu_prop_geom(){
    document.getElementById("Geo_prop").className="btn btn-primary btn-xs";
    document.getElementById("Geo_elementos").className="btn btn-default btn-xs";
    document.getElementById("menu_geo_prop").style.display="block";
    document.getElementById("menu_geo_element").style.display="none";
}
function menu_elementos_geometria() {
    document.getElementById("Geo_prop").className="btn btn-default btn-xs";
    document.getElementById("Geo_elementos").className="btn btn-primary btn-xs";
    document.getElementById("menu_geo_prop").style.display="none";
    document.getElementById("menu_geo_element").style.display="block";
}
function calc_area() {
    var b = document.getElementById('b').value;
    var d = document.getElementById('d').value;
    var tf = document.getElementById('tf').value;
    var tw = document.getElementById('tw').value;
    var type = document.getElementById('select_section').value;
    switch (type){
        case 'images/img/secao_ret.png':
            document.getElementById('area').value = (parseFloat(b)*parseFloat(d)).toFixed(2);
            document.getElementById('inercia').value = ((parseFloat(b)*Math.pow(parseFloat(d),3))/12).toFixed(2);
            break;
        case 'images/img/secao_C.png':
        case 'images/img/secao_I.png':
            document.getElementById('area').value = (2*(parseFloat(b)*parseFloat(tf))+parseFloat(tw)*(parseFloat(d)-2*parseFloat(tf))).toFixed(2);
            document.getElementById('inercia').value = ((parseFloat(tw)*Math.pow(parseFloat(d)-2*parseFloat(tf),3)/12)+2*(parseFloat(b)*Math.pow(parseFloat(tf),3)/12+parseFloat(b)*parseFloat(tf)*(Math.pow(parseFloat(d)-parseFloat(tf),2)/4))).toFixed(2);
            break;
        case 'images/img/secao_L.png':
        case 'images/img/secao_T.png':
            var Y = (parseFloat(b)*parseFloat(tf)*(parseFloat(d)-parseFloat(tf)/2)+parseFloat(tw)*(Math.pow(parseFloat(d)-parseFloat(tf),2)/2))/((parseFloat(b)*parseFloat(tf))+parseFloat(tw)*(parseFloat(d)-parseFloat(tf)));
            document.getElementById('area').value = ((parseFloat(b)*parseFloat(tf))+parseFloat(tw)*(parseFloat(d)-parseFloat(tf))).toFixed(2);
            var a1 = Y-(parseFloat(d)-parseFloat(tf))/2;
            var a2 = (parseFloat(d)-parseFloat(tf)/2)-Y;
            document.getElementById('inercia').value = ((parseFloat(tw)*Math.pow(parseFloat(d)-parseFloat(tf),3)+parseFloat(b)*Math.pow(parseFloat(tf),2))/12+parseFloat(tw)*(parseFloat(d)-parseFloat(tf))*a1*a1+parseFloat(b)*parseFloat(tf)*a2*a2).toFixed(2);
            break;
        case 'images/img/secao_circ.png':
            document.getElementById('area').value = (parseFloat(d)*parseFloat(d)*3.14159265359/4).toFixed(2);
            document.getElementById('inercia').value = ((3.14159265359*Math.pow(parseFloat(d),4))/64).toFixed(2);
            break;
        case 'images/img/secao_tubo.png':
            document.getElementById('area').value = ((parseFloat(d)*parseFloat(d)*3.14159265359/4)-(parseFloat(b)*parseFloat(b)*3.14159265359/4)).toFixed(2);
            document.getElementById('inercia').value = ((3.14159265359*Math.pow(parseFloat(d),4))/64-(3.14159265359*Math.pow(parseFloat(b),4))/64).toFixed(2);
            break;
    }
}
function draw_no(){
    var table = document.getElementById("data_table_no");
    var table_len = (table.rows.length) - 1;
    for (p=1;p<table_len;p++) {
        ctx.beginPath();
        ctx.font = "29px Arial";
        ctx.fillStyle = color_text;
        var x = document.getElementById("data_table_no").rows[p].cells;
        ctx.fillText(x[0].innerHTML,5+SIGMA_X/zIn+(x[1].innerHTML)*canvas.clientHeight/zIn,-23+SIGMA_Y/zIn-(x[2].innerHTML)*canvas.clientHeight/zIn);
        ctx.fillStyle = color_node;
        ctx.arc(SIGMA_X/zIn+(x[1].innerHTML)*canvas.clientHeight/zIn, SIGMA_Y/zIn-(x[2].innerHTML)*canvas.clientHeight/zIn, 5, 0, Math.PI*2);
        if (document.getElementById('rot'+x[0].innerHTML+'').checked===true){
            ctx.drawImage(rotula,-25+SIGMA_X/zIn+(x[1].innerHTML)*canvas.clientHeight/zIn,-25+SIGMA_Y/zIn-(x[2].innerHTML)*canvas.clientHeight/zIn,50,50);
        }
        ctx.closePath();
        ctx.fill();
    }
}
function draw_barra() {
    ctx.lineWidth = 3;
    ctx.strokeStyle = color_barra;
    var table = document.getElementById("data_table_barra");
    var table_len = (table.rows.length)-2;
    if(table_len>0){
        for (p=1;p<(table_len+1);p++) {
            var x = document.getElementById("data_table_barra").rows[p].cells;
            var xi = document.getElementById("x_" + x[1].innerHTML + "").innerHTML;
            var yi = document.getElementById("y_" + x[1].innerHTML + "").innerHTML;
            var xf = document.getElementById("x_" + x[2].innerHTML + "").innerHTML;
            var yf = document.getElementById("y_" + x[2].innerHTML + "").innerHTML;
            ctx.beginPath();
            ctx.moveTo(SIGMA_X/(zIn)+(xi)*canvas.clientHeight/(zIn),SIGMA_Y/(zIn)-(yi)*canvas.clientHeight/(zIn));
            ctx.lineTo(SIGMA_X/(zIn)+(xf)*canvas.clientHeight/(zIn),SIGMA_Y/(zIn)-(yf)*canvas.clientHeight/(zIn));
            ctx.closePath();
            ctx.stroke();
        }
    }
}
function draw_apoio() {
    var table=document.getElementById("data_table_apoio");
    var table_len = (table.rows.length)-1;
    if (table_len>0){
        for (i=1;i<(table_len+1);i++){
            var x = table.rows[i].cells;
            var xi = document.getElementById("x_" + x[0].innerHTML + "").innerHTML;
            var yi = document.getElementById("y_" + x[0].innerHTML + "").innerHTML;
            if(x[1].innerHTML === "Rígido"){
                var test = document.getElementById('row_apoio'+x[0].innerHTML+'').getAttribute('value').split(',');
                var status_text = ''+test[0]+test[1]+test[2]+'';
                ctx.beginPath();
                switch (status_text){
                    case '110':
                        ctx.drawImage(pino,-33+SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn),SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn),70,50);
                        break;
                    case '010':
                        ctx.drawImage(rolete_x,-33+SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn),SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn),70,50);
                        break;
                    case '100':
                        ctx.drawImage(rolete_y,-51+SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn),-33+SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn),50,70);
                        break;
                    case '111':
                        ctx.drawImage(engaste,-31+SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn),-30+SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn),30,70);
                        break;
                    case '101':
                        ctx.drawImage(Engaste_rolete_x,-31+SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn),2+SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn),70,50);
                        break;
                    case '011':
                        ctx.drawImage(Engaste_rolete_y,-53+SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn),-31+SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn),50,70);
                        break;
                    case '001':
                        ctx.drawImage(Placa,-25+SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn),-25+SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn),50,50);
                        break;
                }
                if (test[3]!=='0'){
                    ctx.rotate((test[3]/Math.abs(test[3])-1)*Math.PI/2);
                    ctx.drawImage(Desloc_x,(40*(test[3]/Math.abs(test[3]))-40)+(test[3]/Math.abs(test[3]))*SIGMA_X/zIn+(test[3]/Math.abs(test[3]))*((xi)*canvas.clientHeight/(zIn)),-25+(test[3]/Math.abs(test[3]))*SIGMA_Y/zIn+(test[3]/Math.abs(test[3]))*(-(yi)*canvas.clientHeight/(zIn)),100,50);
                    ctx.rotate(-(test[3]/Math.abs(test[3])-1)*Math.PI/2);
                    ctx.font = "27px Arial";
                    ctx.fillStyle = color_text;
                    ctx.fillText(test[3]+' mm',60+SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn),-10+SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn));
                }
                if (test[4]!=='0'){
                    ctx.rotate((test[4]/Math.abs(test[4])-1)*Math.PI/2);
                    ctx.drawImage(Desloc_y,-25+(test[4]/Math.abs(test[4]))*SIGMA_X/zIn+(test[4]/Math.abs(test[4]))*(xi)*canvas.clientHeight/(zIn),(40*(test[4]/Math.abs(test[4]))-60)+(test[4]/Math.abs(test[4]))*SIGMA_Y/zIn-(test[4]/Math.abs(test[4]))*(yi)*canvas.clientHeight/(zIn),50,100);
                    ctx.rotate(-(test[4]/Math.abs(test[4])-1)*Math.PI/2);
                    ctx.font = "27px Arial";
                    ctx.fillStyle = color_text;
                    ctx.fillText(test[4]+' mm',5+SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn),100+SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn));
                }
                if (test[5]!=='0'){
                    ctx.scale((test[5]/Math.abs(test[5])),1);
                    ctx.drawImage(Desloc_rot,-24+(test[5]/Math.abs(test[5]))*(SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn)),-23+SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn),80,50);
                    ctx.scale((test[5]/Math.abs(test[5])),1);
                    ctx.font = "27px Arial";
                    ctx.fillStyle = color_text;
                    ctx.fillText(test[5]+' rad',40+SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn),35+SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn));
                }
                ctx.closePath();
            }
            if(x[1].innerHTML === "Flexível"){
                var test = document.getElementById('row_apoio'+x[0].innerHTML+'').getAttribute('value').split(',');
                ctx.beginPath();
                if (test[7]!=='0'){
                    ctx.drawImage(Spring_y,-25+SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn),-20+SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn),50,100);
                    ctx.font = "27px Arial";
                    ctx.fillStyle = color_text;
                    ctx.fillText(test[7]+' kN/m',5+SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn),103+SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn));
                }
                if (test[8]!=='0'){
                    ctx.drawImage(Spring_rot,-32+SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn),-40+SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn),80,80);
                    ctx.font = "27px Arial";
                    ctx.fillStyle = color_text;
                    ctx.fillText(test[8]+' kNm/rad',40+SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn),40+SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn));
                }
                if (test[6]!=='0'){
                    ctx.drawImage(Spring_x,-85+SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn),-25+SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn),100,50);
                    ctx.font = "27px Arial";
                    ctx.fillStyle = color_text;
                    ctx.fillText(test[6]+' kN/m',-130+SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn),50+SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn));
                }
                ctx.closePath();
            }
        }
    }
}
function draw_force(){
    var table=document.getElementById("data_table_carga");
    var table_len = (table.rows.length)-1;
    if (table_len>0) {
        for (i = 1; i < (table_len + 1); i++) {
            var x = table.rows[i].cells;
            var p = (x[0].innerHTML).split('');
            if(x[1].innerHTML === "Nodal"){
                var test = document.getElementById('row_no_carga'+p[3]+'').getAttribute('value').split(',');
                var xi = document.getElementById("x_"+p[3]+"").innerHTML;
                var yi = document.getElementById("y_"+p[3]+"").innerHTML;
                ctx.beginPath()
                if (test[0]!=="0"){
                    ctx.rotate((test[0]/Math.abs(test[0])-1)*Math.PI/2);
                    ctx.drawImage(Force_x,(-45*(test[0]/Math.abs(test[0]))-45)+(test[0]/Math.abs(test[0]))*SIGMA_X/zIn+(test[0]/Math.abs(test[0]))*((xi)*canvas.clientHeight/(zIn)),-25+(test[0]/Math.abs(test[0]))*SIGMA_Y/zIn+(test[0]/Math.abs(test[0]))*(-(yi)*canvas.clientHeight/(zIn)),100,50);
                    ctx.rotate(-(test[0]/Math.abs(test[0])-1)*Math.PI/2);
                    ctx.font = "27px Arial";
                    ctx.fillStyle = color_text;
                    ctx.fillText(test[0]+' kN',-120+SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn),30+SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn));
                }
                if (test[1]!=="0"){
                    ctx.rotate((test[1]/Math.abs(test[1])-1)*Math.PI/2);
                    ctx.drawImage(Force_y,(-25)+(test[1]/Math.abs(test[1]))*SIGMA_X/zIn+(test[1]/Math.abs(test[1]))*((xi)*canvas.clientHeight/(zIn)),(-45*(test[1]/Math.abs(test[1]))-55)+(test[1]/Math.abs(test[1]))*SIGMA_Y/zIn+(test[1]/Math.abs(test[1]))*(-(yi)*canvas.clientHeight/(zIn)),50,100);
                    ctx.rotate(-(test[1]/Math.abs(test[1])-1)*Math.PI/2);
                    ctx.font = "27px Arial";
                    ctx.fillStyle = color_text;
                    ctx.fillText(test[1]+' kN',10+SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn),-50+SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn));
                }
                if (test[2]!=="0"){
                    ctx.scale((test[2]/Math.abs(test[2])),1);
                    ctx.drawImage(Force_rot,-55+(test[2]/Math.abs(test[2]))*(SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn)),-30+SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn),80,50);
                    ctx.scale((test[2]/Math.abs(test[2])),1);
                    ctx.font = "27px Arial";
                    ctx.fillStyle = color_text;
                    ctx.fillText(test[2]+' kNm',-120+SIGMA_X/zIn+(xi)*canvas.clientHeight/(zIn),-20+SIGMA_Y/zIn-(yi)*canvas.clientHeight/(zIn));
                }
                ctx.closePath();
            }
        }
    }
}
function draw_carga() {
    scale = document.getElementById("status").value;
    var table=document.getElementById("data_table_carga");
    var table_len = (table.rows.length)-1;
    if (table_len>0) {
        for (i = 1; i < (table_len + 1); i++) {
            var x = table.rows[i].cells;
            var p = (x[0].innerHTML).split('');
            if(x[1].innerHTML === "Distribuida"){
                var test1 = document.getElementById('row_dist_carga'+p[6]+'').getAttribute('value').split(',');
                var xi1 = document.getElementById("x_"+(document.getElementById('inicio_'+p[6])).innerHTML+"").innerHTML;
                var yi1 = document.getElementById("y_"+(document.getElementById('inicio_'+p[6])).innerHTML+"").innerHTML;
                var xf1 = document.getElementById("x_"+(document.getElementById('fim_'+p[6])).innerHTML+"").innerHTML;
                var yf1 = document.getElementById("y_"+(document.getElementById('fim_'+p[6])).innerHTML+"").innerHTML;
                var ang = Math.atan((yf1-yi1)/(xf1-xi1))*180/Math.PI;
                if (test1[2]!=='0' || test1[3]!=='0') {
                    var Max_x = (scale * test1[2] / Math.max(Math.abs(test1[2]), Math.abs(test1[3]))) / zIn;
                    var Max_y = (scale * test1[3] / Math.max(Math.abs(test1[2]), Math.abs(test1[3]))) / zIn;
                    ctx.beginPath();
                    ctx.strokeStyle = '#5c77ff';
                    ctx.fillStyle = color_carga;
                    ctx.moveTo(SIGMA_X / (zIn) + (xi1) * canvas.clientHeight / (zIn),SIGMA_Y / (zIn) - (yi1) * canvas.clientHeight / (zIn));
                    ctx.lineTo(-(-Max_x) * Math.sin(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xi1) * canvas.clientHeight / (zIn), -(-Max_x) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yi1) * canvas.clientHeight / (zIn));
                    ctx.lineTo(-(-Max_y) * Math.sin(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xf1) * canvas.clientHeight / (zIn), -(-Max_y) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yf1) * canvas.clientHeight / (zIn));
                    ctx.lineTo(SIGMA_X / (zIn) + (xf1) * canvas.clientHeight / (zIn),SIGMA_Y / (zIn) - (yf1) * canvas.clientHeight / (zIn));
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();
                    ctx.beginPath();
                    ctx.fillStyle = color_text;
                    ctx.fillText(test1[2]+" kN/m",(Max_x - 20) * Math.sin(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xi1) * canvas.clientHeight / (zIn),(Max_x-20) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yi1) * canvas.clientHeight / (zIn));
                    ctx.textAlign="end";
                    ctx.fillText(test1[3]+" kN/m",(Max_y - 20) * Math.sin(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xf1) * canvas.clientHeight / (zIn), (Max_y-20) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yf1) * canvas.clientHeight / (zIn));
                    ctx.textAlign="start";
                    ctx.fill();
                    ctx.closePath();
                }
                if (test1[0]!=='0' || test1[1]!=='0'){
                    ctx.beginPath();
                    ctx.strokeStyle = '#5c77ff';
                    if (xi1>xf1) {
                        if(test1[0]>0) {
                            ctx.moveTo((20) * Math.sin(ang * Math.PI / 180) + (-100) * Math.cos(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xi1) * canvas.clientHeight / (zIn), (100) * Math.sin(ang * Math.PI / 180) + (20) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yi1) * canvas.clientHeight / (zIn));
                            ctx.lineTo((20) * Math.sin(ang * Math.PI / 180) + (100) * Math.cos(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xf1) * canvas.clientHeight / (zIn), (-100) * Math.sin(ang * Math.PI / 180) + (20) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yf1) * canvas.clientHeight / (zIn));
                            ctx.lineTo((30) * Math.sin(ang * Math.PI / 180) + (120) * Math.cos(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xf1) * canvas.clientHeight / (zIn), (-120) * Math.sin(ang * Math.PI / 180) + (30) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yf1) * canvas.clientHeight / (zIn));
                            ctx.lineTo((20) * Math.sin(ang * Math.PI / 180) + (100) * Math.cos(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xf1) * canvas.clientHeight / (zIn), (-100) * Math.sin(ang * Math.PI / 180) + (20) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yf1) * canvas.clientHeight / (zIn));
                        }else{
                            ctx.moveTo((20) * Math.sin(ang * Math.PI / 180) + (100) * Math.cos(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xf1) * canvas.clientHeight / (zIn), (-100) * Math.sin(ang * Math.PI / 180) + (20) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yf1) * canvas.clientHeight / (zIn));
                            ctx.lineTo((20) * Math.sin(ang * Math.PI / 180) + (-100) * Math.cos(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xi1) * canvas.clientHeight / (zIn), (100) * Math.sin(ang * Math.PI / 180) + (20) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yi1) * canvas.clientHeight / (zIn));
                            ctx.lineTo((30) * Math.sin(ang * Math.PI / 180) + (-120) * Math.cos(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xi1) * canvas.clientHeight / (zIn), (120) * Math.sin(ang * Math.PI / 180) + (30) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yi1) * canvas.clientHeight / (zIn));
                            ctx.lineTo((20) * Math.sin(ang * Math.PI / 180) + (-100) * Math.cos(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xi1) * canvas.clientHeight / (zIn), (100) * Math.sin(ang * Math.PI / 180) + (20) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yi1) * canvas.clientHeight / (zIn));
                        }
                        ctx.fillText(test1[0]+" kN/m",(50) * Math.sin(ang * Math.PI / 180) + (100) * Math.cos(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xf1) * canvas.clientHeight / (zIn), (-100) * Math.sin(ang * Math.PI / 180) + (50) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yf1) * canvas.clientHeight / (zIn));
                    }else{
                        if (test1[0]>0) {
                            ctx.moveTo((20) * Math.sin(ang * Math.PI / 180) + (100) * Math.cos(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xi1) * canvas.clientHeight / (zIn), (-100) * Math.sin(ang * Math.PI / 180) + (20) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yi1) * canvas.clientHeight / (zIn));
                            ctx.lineTo((20) * Math.sin(ang * Math.PI / 180) + (-100) * Math.cos(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xf1) * canvas.clientHeight / (zIn), (100) * Math.sin(ang * Math.PI / 180) + (20) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yf1) * canvas.clientHeight / (zIn));
                            ctx.lineTo((30) * Math.sin(ang * Math.PI / 180) + (-120) * Math.cos(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xf1) * canvas.clientHeight / (zIn), (120) * Math.sin(ang * Math.PI / 180) + (30) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yf1) * canvas.clientHeight / (zIn));
                            ctx.lineTo((20) * Math.sin(ang * Math.PI / 180) + (-100) * Math.cos(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xf1) * canvas.clientHeight / (zIn), (100) * Math.sin(ang * Math.PI / 180) + (20) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yf1) * canvas.clientHeight / (zIn));
                        }else{
                            ctx.moveTo((20) * Math.sin(ang * Math.PI / 180) + (-100) * Math.cos(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xf1) * canvas.clientHeight / (zIn), (100) * Math.sin(ang * Math.PI / 180) + (20) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yf1) * canvas.clientHeight / (zIn));
                            ctx.lineTo((20) * Math.sin(ang * Math.PI / 180) + (100) * Math.cos(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xi1) * canvas.clientHeight / (zIn), (-100) * Math.sin(ang * Math.PI / 180) + (20) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yi1) * canvas.clientHeight / (zIn));
                            ctx.lineTo((30) * Math.sin(ang * Math.PI / 180) + (120) * Math.cos(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xi1) * canvas.clientHeight / (zIn), (-120) * Math.sin(ang * Math.PI / 180) + (30) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yi1) * canvas.clientHeight / (zIn));
                            ctx.lineTo((20) * Math.sin(ang * Math.PI / 180) + (100) * Math.cos(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xi1) * canvas.clientHeight / (zIn), (-100) * Math.sin(ang * Math.PI / 180) + (20) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yi1) * canvas.clientHeight / (zIn));
                        }
                        ctx.fillText(test1[0]+" kN/m",(50) * Math.sin(ang * Math.PI / 180) + (100) * Math.cos(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xi1) * canvas.clientHeight / (zIn), (-100) * Math.sin(ang * Math.PI / 180) + (50) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yi1) * canvas.clientHeight / (zIn));
                    }
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }
}
function menu_resultados(){
    if (document.getElementById("menu_1").style.display === "block") {
        calcular();
        maximos();
        document.getElementById("menu_1").style.display = "none";
        document.getElementById("menu_2").style.display = "block";
        document.getElementById("btn_Resultados").className = "btn btn-primary btn-xs";
        document.getElementById("btn_dados").className="btn btn-default btn-xs";
    }
}
function menu_dados() {
    if (document.getElementById("menu_2").style.display === "block") {
        document.getElementById("menu_1").style.display = "block";
        document.getElementById("menu_2").style.display = "none";
        document.getElementById("btn_dados").className = "btn btn-primary btn-xs";
        document.getElementById("btn_Resultados").className="btn btn-default btn-xs";
    }
}
function res_reacoes() {
    document.getElementById("btn_reac").className = "btn btn-primary btn-xs";
    document.getElementById("btn_norm").className = "btn btn-default btn-xs";
    document.getElementById("btn_cort").className = "btn btn-default btn-xs";
    document.getElementById("btn_momt").className = "btn btn-default btn-xs";
    document.getElementById("btn_deform").className = "btn btn-default btn-xs";
    document.getElementById("Reacoes").style.display = "block";
    document.getElementById("Normais").style.display = "none";
    document.getElementById("Cortantes").style.display = "none";
    document.getElementById("Momentos").style.display = "none";
    document.getElementById("Deformacoes").style.display = "none";
}
function res_normais(){
    document.getElementById("btn_reac").className = "btn btn-default btn-xs";
    document.getElementById("btn_norm").className = "btn btn-primary btn-xs";
    document.getElementById("btn_cort").className = "btn btn-default btn-xs";
    document.getElementById("btn_momt").className = "btn btn-default btn-xs";
    document.getElementById("btn_deform").className = "btn btn-default btn-xs";
    document.getElementById("Reacoes").style.display = "none";
    document.getElementById("Normais").style.display = "block";
    document.getElementById("Cortantes").style.display = "none";
    document.getElementById("Momentos").style.display = "none";
    document.getElementById("Deformacoes").style.display = "none";
}
function res_cortantes() {
    document.getElementById("btn_reac").className = "btn btn-default btn-xs";
    document.getElementById("btn_norm").className = "btn btn-default btn-xs";
    document.getElementById("btn_cort").className = "btn btn-primary btn-xs";
    document.getElementById("btn_momt").className = "btn btn-default btn-xs";
    document.getElementById("btn_deform").className = "btn btn-default btn-xs";
    document.getElementById("Reacoes").style.display = "none";
    document.getElementById("Normais").style.display = "none";
    document.getElementById("Cortantes").style.display = "block";
    document.getElementById("Momentos").style.display = "none";
    document.getElementById("Deformacoes").style.display = "none";
}
function res_momentos() {
    document.getElementById("btn_reac").className = "btn btn-default btn-xs";
    document.getElementById("btn_norm").className = "btn btn-default btn-xs";
    document.getElementById("btn_cort").className = "btn btn-default btn-xs";
    document.getElementById("btn_momt").className = "btn btn-primary btn-xs";
    document.getElementById("btn_deform").className = "btn btn-default btn-xs";
    document.getElementById("Reacoes").style.display = "none";
    document.getElementById("Normais").style.display = "none";
    document.getElementById("Cortantes").style.display = "none";
    document.getElementById("Momentos").style.display = "block";
    document.getElementById("Deformacoes").style.display = "none"
}
function res_desloc() {
    document.getElementById("btn_reac").className = "btn btn-default btn-xs";
    document.getElementById("btn_norm").className = "btn btn-default btn-xs";
    document.getElementById("btn_cort").className = "btn btn-default btn-xs";
    document.getElementById("btn_momt").className = "btn btn-default btn-xs";
    document.getElementById("btn_deform").className = "btn btn-primary btn-xs";
    document.getElementById("Reacoes").style.display = "none";
    document.getElementById("Normais").style.display = "none";
    document.getElementById("Cortantes").style.display = "none";
    document.getElementById("Momentos").style.display = "none";
    document.getElementById("Deformacoes").style.display = "block";
}
function diagram_normal(){
    scale = document.getElementById("status").value;
    var table=document.getElementById("normais_results");
    var table_len = (table.rows.length)-1;
    if (table_len>0) {
        for (i = 1; i < (table_len + 1); i++) {
            var x = table.rows[i].cells;
            var xi1 = document.getElementById("x_"+(document.getElementById('inicio_'+x[0].innerHTML)).innerHTML+"").innerHTML;
            var yi1 = document.getElementById("y_"+(document.getElementById('inicio_'+x[0].innerHTML)).innerHTML+"").innerHTML;
            var xf1 = document.getElementById("x_"+(document.getElementById('fim_'+x[0].innerHTML)).innerHTML+"").innerHTML;
            var yf1 = document.getElementById("y_"+(document.getElementById('fim_'+x[0].innerHTML)).innerHTML+"").innerHTML;
            var ang = Math.atan((yf1-yi1)/(xf1-xi1))*180/Math.PI;
            max_x = -x[1].innerHTML/maximo_normal;
            max_y = x[2].innerHTML/maximo_normal;
            ctx.beginPath();
            ctx.fillStyle = color_diagrams;
            ctx.strokeStyle = '#5c77ff';
            ctx.moveTo(SIGMA_X / (zIn) + (xi1) * canvas.clientHeight / (zIn),SIGMA_Y / (zIn) - (yi1) * canvas.clientHeight / (zIn));
            ctx.lineTo(-(max_x*scale) * Math.sin(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xi1) * canvas.clientHeight / (zIn), -(max_x*scale) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yi1) * canvas.clientHeight / (zIn));
            ctx.lineTo((max_y*scale) * Math.sin(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xf1) * canvas.clientHeight / (zIn), (max_y*scale) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yf1) * canvas.clientHeight / (zIn));
            ctx.lineTo(SIGMA_X / (zIn) + (xf1) * canvas.clientHeight / (zIn),SIGMA_Y / (zIn) - (yf1) * canvas.clientHeight / (zIn));
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.fillStyle = color_text;
            ctx.fillText((Number(x[1].innerHTML)/1000).toFixed(2)+" kN",-(max_x*scale+10) * Math.sin(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xi1) * canvas.clientHeight / (zIn),-(max_x*scale+10) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yi1) * canvas.clientHeight / (zIn));
            ctx.textAlign="end";
            ctx.fillText((Number(x[2].innerHTML)/1000).toFixed(2)+" kN",(max_y*scale+10) * Math.sin(ang * Math.PI / 180) + SIGMA_X / (zIn) + (xf1) * canvas.clientHeight / (zIn),(max_y*scale+10) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yf1) * canvas.clientHeight / (zIn));
            ctx.textAlign="start";
            ctx.fill();
            ctx.closePath();
        }
    }
}
function diagram_cortan(){
    scale = document.getElementById("status").value;
    var table=document.getElementById("cortant_results");
    var table_len = (table.rows.length)-1;
    if (table_len>0) {
        for (i = 1; i < (table_len + 1); i++) {
            var x = table.rows[i].cells;
            var xi1 = document.getElementById("x_"+(document.getElementById('inicio_'+x[0].innerHTML)).innerHTML+"").innerHTML;
            var yi1 = document.getElementById("y_"+(document.getElementById('inicio_'+x[0].innerHTML)).innerHTML+"").innerHTML;
            var xf1 = document.getElementById("x_"+(document.getElementById('fim_'+x[0].innerHTML)).innerHTML+"").innerHTML;
            var yf1 = document.getElementById("y_"+(document.getElementById('fim_'+x[0].innerHTML)).innerHTML+"").innerHTML;
            var ang = Math.atan((yf1-yi1)/(xf1-xi1))*180/Math.PI;
            var L = (Math.sqrt(Math.pow(xf1 - xi1, 2) + Math.pow(yf1 - yi1, 2)))*canvas.clientHeight;
            power = [];
            if (document.getElementById('row_dist_carga'+x[0].innerHTML)!== null){
                var power = (document.getElementById('row_dist_carga'+x[0].innerHTML).getAttribute('value')).split(',');
            }else{power = [0,0,0,0]}
            Lp = L/canvas.clientHeight;
            g1=-power[2];
            g2=-power[3];
            RAv = Number(x[1].innerHTML);
            Lvar=(canvas.clientHeight*(xf1-xi1));
            Lvar1=-(canvas.clientHeight*(yf1-yi1));
            max_x = -x[1].innerHTML/maximo_cortante;
            max_y = x[2].innerHTML/maximo_cortante;
            ctx.beginPath();
            ctx.fillStyle = color_diagrams;
            ctx.strokeStyle = '#5c77ff';
            ctx.moveTo(SIGMA_X / (zIn) + (xi1) * canvas.clientHeight / (zIn),SIGMA_Y / (zIn) - (yi1) * canvas.clientHeight / (zIn));
            for (k=0;k<16;k++) {
                ctx.lineTo(-(-(g2-g1)*1000*Math.pow((k*Lp/15),2)/(2*Lp)-g1*1000*(k*Lp/15)+RAv)*scale*Math.sin(ang*Math.PI/180)/Math.abs(maximo_cortante)+SIGMA_X/(zIn)+(k*Lvar/(zIn*15))+(xi1)*canvas.clientHeight/(zIn), -(-(g2-g1)*1000*Math.pow((k*Lp/15),2)/(2*Lp)-g1*1000*(k*Lp/15)+RAv)*scale*Math.cos(ang*Math.PI/180)/(Math.abs(maximo_cortante))+SIGMA_Y/(zIn)+(k*Lvar1/(zIn*15))-(yi1)*canvas.clientHeight/(zIn));
            }
            ctx.lineTo(SIGMA_X / (zIn) + (xf1) * canvas.clientHeight / (zIn),SIGMA_Y / (zIn) - (yf1) * canvas.clientHeight / (zIn));
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.fillStyle = color_text;
            ctx.fillText((Number(x[1].innerHTML/1000)).toFixed(2) +" kN",(max_x*scale+10) * Math.sin(ang * Math.PI / 180) + SIGMA_X / (zIn)+(xi1)*canvas.clientHeight/(zIn),(max_x*scale+10) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yi1) * canvas.clientHeight / (zIn));
            ctx.textAlign="end";
            ctx.fillText((Number(-x[2].innerHTML/1000)).toFixed(2)+" kN",(max_y*scale+10) * Math.sin(ang * Math.PI / 180) + SIGMA_X / (zIn)+(xf1)*canvas.clientHeight/(zIn),(max_y*scale+10) * Math.cos(ang * Math.PI / 180) + SIGMA_Y / (zIn) - (yf1) * canvas.clientHeight / (zIn));
            ctx.textAlign="start";
            ctx.fill();
            ctx.closePath();
        }
    }
}
function diagram_moment(){
    scale = document.getElementById('status').value;
    var table=document.getElementById("moment_results");
    var table_len = (table.rows.length)-1;
    if (table_len>0) {
        for (i = 1; i < (table_len + 1); i++) {
            var x = table.rows[i].cells;
            var xi1 = document.getElementById("x_"+(document.getElementById('inicio_'+x[0].innerHTML)).innerHTML+"").innerHTML;
            var yi1 = document.getElementById("y_"+(document.getElementById('inicio_'+x[0].innerHTML)).innerHTML+"").innerHTML;
            var xf1 = document.getElementById("x_"+(document.getElementById('fim_'+x[0].innerHTML)).innerHTML+"").innerHTML;
            var yf1 = document.getElementById("y_"+(document.getElementById('fim_'+x[0].innerHTML)).innerHTML+"").innerHTML;
            var ang = Math.atan((yf1-yi1)/(xf1-xi1))*180/Math.PI;
            var L = (Math.sqrt(Math.pow(xf1 - xi1, 2) + Math.pow(yf1 - yi1, 2)))*canvas.clientHeight;
            var c = Math.cos(ang*Math.PI/180);
            var s = Math.sin(ang*Math.PI/180);

            power = [];
            if (document.getElementById('row_dist_carga'+x[0].innerHTML)!== null){
                var power = (document.getElementById('row_dist_carga'+x[0].innerHTML).getAttribute('value')).split(',');
            }else{power = [0,0,0,0]}
            if (xi1<=xf1) {
                var correc = 1;
            }else{correc = -1;}

            Lp = L/canvas.clientHeight;
            g1=-power[2]*correc;
            g2=-power[3]*correc;
            var RA = (2*g1+g2)*1000*(Lp)/6+(Number(x[1].innerHTML)+Number(x[2].innerHTML))/(Lp);
            Lvar=(canvas.clientHeight*(xf1-xi1));
            Lvar1=-(canvas.clientHeight*(yf1-yi1));
            max_x = x[1].innerHTML;
            max_y = x[2].innerHTML;
            ctx.beginPath();
            ctx.fillStyle = color_diagrams;
            ctx.strokeStyle = '#5c77ff';
            ctx.moveTo(SIGMA_X/(zIn)+(xi1)*canvas.clientHeight/(zIn),SIGMA_Y/(zIn)-(yi1)*canvas.clientHeight/(zIn));
            for (k=0;k<16;k++) {
                funy=(-max_x+(-(g2-g1)*1000*Math.pow((k*Lp/15),3)/(6*Lp)-(g1*1000*Math.pow((k*Lp/15),2))/2)+RA*(k*Lp/15));
                ctx.lineTo( funy*s*scale/Math.abs(maximo_momento)+SIGMA_X/(zIn)+(k*Lvar/(zIn*15))+(xi1)*canvas.clientHeight/(zIn),
                            funy*c*scale/Math.abs(maximo_momento)+SIGMA_Y/(zIn)+(k*Lvar1/(zIn*15))-(yi1)*canvas.clientHeight/(zIn));
            }
            ctx.lineTo(SIGMA_X/(zIn)+(xf1)*canvas.clientHeight/(zIn),SIGMA_Y/(zIn)-(yf1)*canvas.clientHeight/(zIn));
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.fillStyle = color_text;
            ctx.fillText((Number(x[1].innerHTML/1000)).toFixed(2) +" kNm" , correc*(-max_x)*scale*s/Math.abs(maximo_momento)+SIGMA_X/(zIn)+(xi1)*canvas.clientHeight/(zIn),
                                                                            correc*(-max_x)*scale*c/(Math.abs(maximo_momento))+SIGMA_Y/(zIn)-(yi1)*canvas.clientHeight/(zIn));
            ctx.textAlign="end";
            ctx.fillText((Number(-x[2].innerHTML/1000)).toFixed(2) +" kNm", (correc*(-max_x+(-(g2-g1)*1000*Math.pow((Lp),3)/(6*Lp)-(g1*1000*Math.pow((Lp),2))/2)+RA*(Lp)))*scale*s/Math.abs(maximo_momento)+SIGMA_X/(zIn)+(Lvar/(zIn))+(xi1)*canvas.clientHeight/(zIn),
                                                                            (correc*(-max_x+(-(g2-g1)*1000*Math.pow((Lp),3)/(6*Lp)-(g1*1000*Math.pow((Lp),2))/2)+RA*(Lp)))*scale*c/(Math.abs(maximo_momento))+SIGMA_Y/(zIn)+(Lvar1/(zIn))-(yi1)*canvas.clientHeight/(zIn));
            ctx.textAlign="start";
            ctx.fill();
            ctx.closePath();
        }
    }
}
function deformation(){
    scale = document.getElementById('status').value;
    var table=document.getElementById("moment_results");
    var table_len = (table.rows.length)-1;
    if (table_len>0) {
        for (i = 1; i < (table_len + 1); i++) {
            var y = table.rows[i].cells;
            var xi = document.getElementById("x_"+(document.getElementById('inicio_'+y[0].innerHTML)).innerHTML+"").innerHTML;
            var yi = document.getElementById("y_"+(document.getElementById('inicio_'+y[0].innerHTML)).innerHTML+"").innerHTML;
            var xf = document.getElementById("x_"+(document.getElementById('fim_'+y[0].innerHTML)).innerHTML+"").innerHTML;
            var yf = document.getElementById("y_"+(document.getElementById('fim_'+y[0].innerHTML)).innerHTML+"").innerHTML;
            var E = Number(document.getElementById('Elast'+y[0].innerHTML+'').innerHTML)*Math.pow(10,9);
            var I = Number(document.getElementById('I_barra'+y[0].innerHTML+'').innerHTML)*Math.pow(10,-8);
            Lp1 = (Math.sqrt(Math.pow(xf - xi, 2) + Math.pow(yf - yi, 2)));
            var c = (xf-xi)/Lp1;
            var s = (yf-yi)/Lp1;

            if (xi<xf) {
                correc = 1;
            }else{correc = -1;}

            power = [];
            if (document.getElementById('row_dist_carga'+y[0].innerHTML)!== null){
                var power = (document.getElementById('row_dist_carga'+y[0].innerHTML).getAttribute('value')).split(',');
            }else{power = [0,0,0,0]}
            qvi = -power[2]/(E*I/1000);
            qvf = -power[3]/(E*I/1000);
            dv1 = document.getElementById("dy"+(document.getElementById('inicio_'+y[0].innerHTML)).innerHTML+"").getAttribute('value');
            dv2 = document.getElementById("dy"+(document.getElementById('fim_'+y[0].innerHTML)).innerHTML+"").getAttribute('value');
            dz1 = document.getElementById("dz"+(document.getElementById('inicio_'+y[0].innerHTML)).innerHTML+"").getAttribute('value');
            dz2 = document.getElementById("dz"+(document.getElementById('fim_'+y[0].innerHTML)).innerHTML+"").getAttribute('value');
            dh1 = document.getElementById("dx"+(document.getElementById('inicio_'+y[0].innerHTML)).innerHTML+"").getAttribute('value');
            dh2 = document.getElementById("dx"+(document.getElementById('fim_'+y[0].innerHTML)).innerHTML+"").getAttribute('value');

            v1 = dv1*c-dh1*s;
            v2 = dv2*c-dh2*s;

            ctx.beginPath();
            ctx.strokeStyle = '#ff484b';
            for (j=0;j<16;j++){
                x = j*Lp1/15;
                Q1 = -(qvf*(Math.pow(x,5)-3*Math.pow(Lp1,2)*Math.pow(x,3)+2*Math.pow(Lp1,3)*Math.pow(x,2))+qvi*(-Math.pow(x,5)+5*Lp1*Math.pow(x,4)-7*Math.pow(Lp1,2)*Math.pow(x,3)+3*Math.pow(Lp1,3)*Math.pow(x,2)))/(120*Lp1);
                H1 = -(-2*Math.pow(x,3)+3*Lp1*Math.pow(x,2)-Math.pow(Lp1,3))/(Math.pow(Lp1,3));
                H2 = -(-Math.pow(x,3)+2*Lp1*Math.pow(x,2)-Math.pow(Lp1,2)*x)/(Math.pow(Lp1,2));
                H3 = -(2*Math.pow(x,3)-3*Lp1*Math.pow(x,2))/(Math.pow(Lp1,3));
                H4 = -(Math.pow(Lp1,2)*Math.pow(x,2)-Lp1*Math.pow(x,3))/(Math.pow(Lp1,3));
                H5 = (1-j/15);
                H6 = (j/15);
                eq1 = (correc*(Q1)+H1*v1+H2*dz1+H3*v2+H4*dz2)/maximo_deform;
                en1 = (H5*(dv1*s+dh1*c)+H6*(dv2*s+dh2*c))/maximo_deform;
                ctx.lineTo(-5*(-en1*c+eq1*s)*scale/(zIn)+SIGMA_X/(zIn)+canvas.clientHeight*j*Lp1/(zIn*15)*c+(xi)*canvas.clientHeight/(zIn),
                           -5*(en1*s+eq1*c)*scale/(zIn)+SIGMA_Y/(zIn)-canvas.clientHeight*j*Lp1/(zIn*15)*s-(yi)*canvas.clientHeight/(zIn));
            }
            ctx.stroke();
            ctx.closePath();
        }
    }
}
function maximos(){
    //Desloc
    maximo_deform = 0;
    var table = document.getElementById("moment_results");
    var table_len = (table.rows.length) - 1;
    if (table_len > 0) {
        for (i = 1; i < (table_len + 1); i++) {
            var y = table.rows[i].cells;
            var xi = document.getElementById("x_" + (document.getElementById('inicio_' + y[0].innerHTML)).innerHTML + "").innerHTML;
            var yi = document.getElementById("y_" + (document.getElementById('inicio_' + y[0].innerHTML)).innerHTML + "").innerHTML;
            var xf = document.getElementById("x_" + (document.getElementById('fim_' + y[0].innerHTML)).innerHTML + "").innerHTML;
            var yf = document.getElementById("y_" + (document.getElementById('fim_' + y[0].innerHTML)).innerHTML + "").innerHTML;
            var E = Number(document.getElementById('Elast' + y[0].innerHTML + '').innerHTML) * Math.pow(10, 9);
            var I = Number(document.getElementById('I_barra' + y[0].innerHTML + '').innerHTML) * Math.pow(10, -8);
            Lp1 = (Math.sqrt(Math.pow(xf - xi, 2) + Math.pow(yf - yi, 2)));
            var c = (xf - xi) / Lp1;
            var s = (yf - yi) / Lp1;

            if (xi < xf) {
                correc = 1;
            } else {
                correc = -1;
            }

            power = [];
            if (document.getElementById('row_dist_carga' + y[0].innerHTML) !== null) {
                var power = (document.getElementById('row_dist_carga' + y[0].innerHTML).getAttribute('value')).split(',');
            } else {
                power = [0, 0, 0, 0]
            }
            qvi = -power[2] / (E * I / 1000);
            qvf = -power[3] / (E * I / 1000);
            dv1 = document.getElementById("dy" + (document.getElementById('inicio_' + y[0].innerHTML)).innerHTML + "").getAttribute('value');
            dv2 = document.getElementById("dy" + (document.getElementById('fim_' + y[0].innerHTML)).innerHTML + "").getAttribute('value');
            dz1 = document.getElementById("dz" + (document.getElementById('inicio_' + y[0].innerHTML)).innerHTML + "").getAttribute('value');
            dz2 = document.getElementById("dz" + (document.getElementById('fim_' + y[0].innerHTML)).innerHTML + "").getAttribute('value');
            dh1 = document.getElementById("dx" + (document.getElementById('inicio_' + y[0].innerHTML)).innerHTML + "").getAttribute('value');
            dh2 = document.getElementById("dx" + (document.getElementById('fim_' + y[0].innerHTML)).innerHTML + "").getAttribute('value');

            v1 = dv1 * c - dh1 * s;
            v2 = dv2 * c - dh2 * s;
            for (j=0;j<8;j++) {
                x = j * Lp1 / 7;
                Q1 = -(qvf * (Math.pow(x, 5) - 3 * Math.pow(Lp1, 2) * Math.pow(x, 3) + 2 * Math.pow(Lp1, 3) * Math.pow(x, 2)) + qvi * (-Math.pow(x, 5) + 5 * Lp1 * Math.pow(x, 4) - 7 * Math.pow(Lp1, 2) * Math.pow(x, 3) + 3 * Math.pow(Lp1, 3) * Math.pow(x, 2))) / (120 * Lp1);
                H1 = -(-2 * Math.pow(x, 3) + 3 * Lp1 * Math.pow(x, 2) - Math.pow(Lp1, 3)) / (Math.pow(Lp1, 3));
                H2 = -(-Math.pow(x, 3) + 2 * Lp1 * Math.pow(x, 2) - Math.pow(Lp1, 2) * x) / (Math.pow(Lp1, 2));
                H3 = -(2 * Math.pow(x, 3) - 3 * Lp1 * Math.pow(x, 2)) / (Math.pow(Lp1, 3));
                H4 = -(Math.pow(Lp1, 2) * Math.pow(x, 2) - Lp1 * Math.pow(x, 3)) / (Math.pow(Lp1, 3));
                H5 = (1 - j / 7);
                H6 = (j / 7);
                eq1 = correc * (Q1) + H1 * v1 + H2 * dz1 + H3 * v2 + H4 * dz2;
                en1 = (H5 * (dv1 * s + dh1 * c) + H6 * (dv2 * s + dh2 * c));
                maximo_deform = Math.max(maximo_deform,Math.abs(eq1));
                maximo_deform = Math.max(maximo_deform,Math.abs(en1));
            }
        }
    }
    //Moments
    maximo_momento = 0;
    var table=document.getElementById("moment_results");
    var table_len = (table.rows.length)-1;
    if (table_len>0) {
        for (i = 1; i < (table_len + 1); i++) {
            var y = table.rows[i].cells;
            var xi = document.getElementById("x_"+(document.getElementById('inicio_'+y[0].innerHTML)).innerHTML+"").innerHTML;
            var yi = document.getElementById("y_"+(document.getElementById('inicio_'+y[0].innerHTML)).innerHTML+"").innerHTML;
            var xf = document.getElementById("x_"+(document.getElementById('fim_'+y[0].innerHTML)).innerHTML+"").innerHTML;
            var yf = document.getElementById("y_"+(document.getElementById('fim_'+y[0].innerHTML)).innerHTML+"").innerHTML;
            Lp1 = (Math.sqrt(Math.pow(xf - xi, 2) + Math.pow(yf - yi, 2)));
            var power1 = [];
            if (document.getElementById('row_dist_carga'+y[0].innerHTML)!== null){
                power1 = (document.getElementById('row_dist_carga'+y[0].innerHTML).getAttribute('value')).split(',');
            }else{power1=[0,0,0,0]}
            if (xi<xf && (xi-xf)!==0) {
                correc = 1;
            }else{correc = -1;}

            g1=-power1[2];
            g2 =-power1[3];
            RAm = (2*g1+g2)*1000*Lp1/6+(Number(y[1].innerHTML)+Number(y[2].innerHTML))/(Lp1);
            for(j=0;j<16;j++) {
                maximo_momento = Math.max(maximo_momento,Math.abs(-y[1].innerHTML+(-(g2-g1)*1000*Math.pow((j*Lp1/15),3)/(6*Lp1)-(g1*1000*Math.pow((j*Lp1/15),2))/2+RAm*(j*Lp1/15))));
            }
        }
    }
    if (table_len > 0) {
        for (i = 1; i < (table_len + 1); i++) {
            var y = table.rows[i].cells;
            var xi = document.getElementById("x_" + (document.getElementById('inicio_' + y[0].innerHTML)).innerHTML + "").innerHTML;
            var yi = document.getElementById("y_" + (document.getElementById('inicio_' + y[0].innerHTML)).innerHTML + "").innerHTML;
            var xf = document.getElementById("x_" + (document.getElementById('fim_' + y[0].innerHTML)).innerHTML + "").innerHTML;
            var yf = document.getElementById("y_" + (document.getElementById('fim_' + y[0].innerHTML)).innerHTML + "").innerHTML;
            var E = Number(document.getElementById('Elast' + y[0].innerHTML + '').innerHTML) * Math.pow(10, 9);
            var I = Number(document.getElementById('I_barra' + y[0].innerHTML + '').innerHTML) * Math.pow(10, -8);
            Lp1 = (Math.sqrt(Math.pow(xf - xi, 2) + Math.pow(yf - yi, 2)));
            var c = (xf - xi) / Lp1;
            var s = (yf - yi) / Lp1;

            if (xi < xf) {
                correc = 1;
            } else {
                correc = -1;
            }

            power = [];
            if (document.getElementById('row_dist_carga' + y[0].innerHTML) !== null) {
                var power = (document.getElementById('row_dist_carga' + y[0].innerHTML).getAttribute('value')).split(',');
            } else {
                power = [0, 0, 0, 0]
            }
            qvi = -power[2] / (E * I / 1000);
            qvf = -power[3] / (E * I / 1000);
            dv1 = document.getElementById("dy" + (document.getElementById('inicio_' + y[0].innerHTML)).innerHTML + "").getAttribute('value');
            dv2 = document.getElementById("dy" + (document.getElementById('fim_' + y[0].innerHTML)).innerHTML + "").getAttribute('value');
            dz1 = document.getElementById("dz" + (document.getElementById('inicio_' + y[0].innerHTML)).innerHTML + "").getAttribute('value');
            dz2 = document.getElementById("dz" + (document.getElementById('fim_' + y[0].innerHTML)).innerHTML + "").getAttribute('value');
            dh1 = document.getElementById("dx" + (document.getElementById('inicio_' + y[0].innerHTML)).innerHTML + "").getAttribute('value');
            dh2 = document.getElementById("dx" + (document.getElementById('fim_' + y[0].innerHTML)).innerHTML + "").getAttribute('value');

            v1 = dv1 * c - dh1 * s;
            v2 = dv2 * c - dh2 * s;
            for (j=0;j<8;j++) {
                x = j * Lp1 / 7;
                Q1 = -(qvf * (Math.pow(x, 5) - 3 * Math.pow(Lp1, 2) * Math.pow(x, 3) + 2 * Math.pow(Lp1, 3) * Math.pow(x, 2)) + qvi * (-Math.pow(x, 5) + 5 * Lp1 * Math.pow(x, 4) - 7 * Math.pow(Lp1, 2) * Math.pow(x, 3) + 3 * Math.pow(Lp1, 3) * Math.pow(x, 2))) / (120 * Lp1);
                H1 = -(-2 * Math.pow(x, 3) + 3 * Lp1 * Math.pow(x, 2) - Math.pow(Lp1, 3)) / (Math.pow(Lp1, 3));
                H2 = -(-Math.pow(x, 3) + 2 * Lp1 * Math.pow(x, 2) - Math.pow(Lp1, 2) * x) / (Math.pow(Lp1, 2));
                H3 = -(2 * Math.pow(x, 3) - 3 * Lp1 * Math.pow(x, 2)) / (Math.pow(Lp1, 3));
                H4 = -(Math.pow(Lp1, 2) * Math.pow(x, 2) - Lp1 * Math.pow(x, 3)) / (Math.pow(Lp1, 3));
                H5 = (1 - j / 7);
                H6 = (j / 7);
                eq1 = correc * (Q1) + H1 * v1 + H2 * dz1 + H3 * v2 + H4 * dz2;
                en1 = (H5 * (dv1 * s + dh1 * c) + H6 * (dv2 * s + dh2 * c));
                maximo_deform = Math.max(maximo_deform,Math.abs(eq1));
                maximo_deform = Math.max(maximo_deform,Math.abs(en1));
            }
        }
    }
    //Cortant
    maximo_cortante = 0;
    var table=document.getElementById("cortant_results");
    var table_len = (table.rows.length)-1;
    if (table_len>0) {
        for (i = 1; i < (table_len + 1); i++) {
            var y = table.rows[i].cells;
            var xi = document.getElementById("x_"+(document.getElementById('inicio_'+y[0].innerHTML)).innerHTML+"").innerHTML;
            var yi = document.getElementById("y_"+(document.getElementById('inicio_'+y[0].innerHTML)).innerHTML+"").innerHTML;
            var xf = document.getElementById("x_"+(document.getElementById('fim_'+y[0].innerHTML)).innerHTML+"").innerHTML;
            var yf = document.getElementById("y_"+(document.getElementById('fim_'+y[0].innerHTML)).innerHTML+"").innerHTML;
            Lp1 = (Math.sqrt(Math.pow(xf - xi, 2) + Math.pow(yf - yi, 2)));
            var power1 = [];
            if (document.getElementById('row_dist_carga'+y[0].innerHTML)!== null){
                power1 = (document.getElementById('row_dist_carga'+y[0].innerHTML).getAttribute('value')).split(',');
            }else{power1=[0,0,0,0]}
            g1=-power1[2];
            g2 =-power1[3];
            RAm = Number(y[1].innerHTML);
            for(j=0;j<16;j++) {
                if (Math.abs(-y[1].innerHTML + (-(g2-g1)*1000*Math.pow((j*Lp1/15),2)/(2*Lp1)-(g1*1000*(j*Lp1/15))))>maximo_cortante){
                    maximo_cortante = Math.abs(-y[1].innerHTML + (-(g2-g1)*1000*Math.pow((j*Lp1/15),2)/(2*Lp1)-(g1*1000*(j*Lp1/15))));
                }
            }
        }
    }
    //Normal
    maximo_normal = 0;
    var table=document.getElementById("normais_results");
    var table_len = (table.rows.length)-1;
    if (table_len>0) {
        for (i = 1; i < (table_len + 1); i++) {
            var y = table.rows[i].cells;
            if (Math.abs(y[1].innerHTML)>Math.abs(maximo_normal)){
                maximo_normal = Math.abs(y[1].innerHTML);
            }
            if (Math.abs(y[2].innerHTML)>Math.abs(maximo_normal)){
                maximo_normal = Math.abs(y[2].innerHTML);
            }
        }
    }
}
function calcular() {
    matrizGlobal=[];
    matrizTotal=[];
    force = [];
    force2= [];
    apoio_status=[];
    desloc_vetor = [];
    reacoes_result =[];
    test = [];
    normal_result=[]
    cortant_result=[];
    momento_result=[];

    var Hi=0,Vi=0,Mi=0;
    var Hf=0,Vf=0,Mf=0;
    var table_no = document.getElementById('data_table_no');
    console.log(table_no)
    var table_no_len = table_no.rows.length;
    var table_bar = document.getElementById('data_table_barra');
    var tabble_bar_len = table_bar.rows.length;

    // criar matriz global zero
    for (i=3;i<(3*(table_no_len-1));i++){
        for (j=3;j<(3*(table_no_len-1));j++){
            matriz_x.push(0);
        }
        matrizGlobal.push(matriz_x);
        matriz_x=[];
    }
    for (i=3;i<(3*(table_no_len-1));i++){
        for (j=3;j<(3*(table_no_len-1));j++){
            matriz_x.push(0);
        }
        matrizTotal.push(matriz_x);
        matriz_x=[];
    }
    //Apoios e Forças
    for (i=1;i<(table_no_len-1);i++){
        var x = table_no.rows[i].cells;
        if (document.getElementById('row_no_carga'+document.getElementById('No'+x[0].innerHTML+'').innerHTML+'') === null){
            force.push(0,0,0);
        }else {
            h = (document.getElementById('row_no_carga' + document.getElementById('No' + x[0].innerHTML + '').innerHTML + '').getAttribute('value')).split(',');
            force.push(h[0]*1000,h[1]*1000,h[2]*1000);
        }
        if(document.getElementById('row_apoio'+document.getElementById('No'+x[0].innerHTML+'').innerHTML+'') === null){
            apoio_status.push(1,1,1);
        }else{
            apo=(document.getElementById('row_apoio' + document.getElementById('No' + x[0].innerHTML + '').innerHTML + '').getAttribute('value')).split(',');
            apoio_status.push(Number(1-apo[0]),Number(1-apo[1]),Number(1-apo[2]));
        }
    }

    for (i=1;i<(tabble_bar_len-1);i++) {
        var p = table_bar.rows[i].cells;
        force2 = [];
        var L = Math.sqrt(Math.pow(document.getElementById('x_' + p[1].innerHTML).innerHTML - document.getElementById('x_' + p[2].innerHTML).innerHTML, 2) + Math.pow(document.getElementById('y_' + p[1].innerHTML).innerHTML - document.getElementById('y_' + p[2].innerHTML).innerHTML, 2));
        var c = ((document.getElementById('x_' + p[2].innerHTML).innerHTML - document.getElementById('x_' + p[1].innerHTML).innerHTML)/L);
        var s = ((document.getElementById('y_' + p[2].innerHTML).innerHTML - document.getElementById('y_' + p[1].innerHTML).innerHTML)/L);
        var E = Number(document.getElementById('Elast'+p[0].innerHTML+'').innerHTML)*Math.pow(10,9);
        var I = Number(document.getElementById('I_barra'+p[0].innerHTML+'').innerHTML)*Math.pow(10,-8);
        var A = Number(document.getElementById('A_barra'+p[0].innerHTML+'').innerHTML)*Math.pow(10,-4);

        if (c<0) {
            correc = -1;
        }
        else{
            correc = 1;
        }

        if (document.getElementById('row_dist_carga' + document.getElementById('barra' + p[0].innerHTML + '').innerHTML + '') === null) {
            Hi = 0; Vi = 0; Mi = 0; Hf = 0; Vf = 0; Mf = 0;
        } else {
            var force2 = (document.getElementById('row_dist_carga' + document.getElementById('barra' + p[0].innerHTML + '').innerHTML + '').getAttribute('value')).split(',');
            Hi = (force2[0] / 2)*1000;
            Hf = (force2[0] / 2)*1000;
            Vi = correc*((2 * force2[2] * L + force2[3] * L) / 6)*1000;
            Vf = correc*((force2[2] * L + 2 * force2[3] * L) / 6)*1000;
            Mi = correc*((6 * force2[2] * Math.pow(L, 2) + 4 * force2[3] * Math.pow(L, 2)) / 120)*1000;
            Mf = correc*(-(4 * force2[2] * Math.pow(L, 2) + 6 * force2[3] * Math.pow(L, 2)) / 120)*1000;
        }
        R1 = 1;
        R2 = 1;
        if (document.getElementById('rot'+p[1].innerHTML+'').checked === true){
            apoio_status[(linhaX-1)*3+2]=1;
            R1 = 0;
        }
        if (document.getElementById('rot'+p[2].innerHTML+'').checked === true){
            apoio_status[(linhaY-1)*3+2]=1;
            R2 = 0;
        }
        /*
        matrizLocal = [
            [(12*E*I*Math.pow(s,2))/Math.pow(L,3)+(A*E*Math.pow(c,2))/L ,(A*E*c*s)/L-(12*E*I*c*s)/Math.pow(L,3)                     ,-(6*E*I*s)/Math.pow(L,2),-(12*E*I*Math.pow(s,2))/Math.pow(L,3)-(A*E*Math.pow(c,2))/L ,(12*E*I*c*s)/Math.pow(L,3)-(A*E*c*s)/L                     ,-(6*E*I*s)/Math.pow(L,2)],
            [(A*E*c*s)/L-(12*E*I*c*s)/Math.pow(L,3)                     ,(A*E*Math.pow(s,2))/L+(12*E*I*Math.pow(c,2))/Math.pow(L,3) ,(6*E*I*c)/Math.pow(L,2) ,(12*E*I*c*s)/Math.pow(L,3)-(A*E*c*s)/L                      ,-(A*E*Math.pow(s,2))/L-(12*E*I*Math.pow(c,2))/Math.pow(L,3),(6*E*I*c)/Math.pow(L,2)],
            [-(6*E*I*s)/Math.pow(L,2)                                   ,(6*E*I*c)/Math.pow(L,2)                                    ,(4*E*I)/L               ,(6*E*I*s)/Math.pow(L,2)                                     ,-(6*E*I*c)/Math.pow(L,2)                                   ,(2*E*I)/L],
            [-(12*E*I*Math.pow(s,2))/Math.pow(L,3)-(A*E*Math.pow(c,2))/L,(12*E*I*c*s)/Math.pow(L,3)-(A*E*c*s)/L                     ,(6*E*I*s)/Math.pow(L,2) ,(12*E*I*Math.pow(s,2))/Math.pow(L,3)+(A*E*Math.pow(c,2))/L  ,(A*E*c*s)/L-(12*E*I*c*s)/Math.pow(L,3)                     ,(6*E*I*s)/Math.pow(L,2)],
            [(12*E*I*c*s)/Math.pow(L,3)-(A*E*c*s)/L                     ,-(A*E*Math.pow(s,2))/L-(12*E*I*Math.pow(c,2))/Math.pow(L,3),-(6*E*I*c)/Math.pow(L,2),(A*E*c*s)/L-(12*E*I*c*s)/Math.pow(L,3)                      ,(A*E*Math.pow(s,2))/L+(12*E*I*Math.pow(c,2))/Math.pow(L,3) ,-(6*E*I*c)/Math.pow(L,2)],
            [-(6*E*I*s)/Math.pow(L,2)                                   ,(6*E*I*c)/Math.pow(L,2)                                    ,(2*E*I)/L               ,(6*E*I*s)/Math.pow(L,2)                                      ,-(6*E*I*c)/Math.pow(L,2)                                  ,(4*E*I)/L]
        ];
        */

        matrizLocal = [
            [(R1*12*E*I*Math.pow(s,2))/Math.pow(L,3)+(A*E*Math.pow(c,2))/L    ,(A*E*c*s)/L-(R1*12*E*I*c*s)/Math.pow(L,3)                        ,-(R1*6*E*I*s)/Math.pow(L,2)   ,-(R1*R2*12*E*I*Math.pow(s,2))/Math.pow(L,3)-(A*E*Math.pow(c,2))/L ,(R1*R2*12*E*I*c*s)/Math.pow(L,3)-(A*E*c*s)/L                     ,-(R1*R2*6*E*I*s)/Math.pow(L,2)],
            [(A*E*c*s)/L-(R1*12*E*I*c*s)/Math.pow(L,3)                        ,(A*E*Math.pow(s,2))/L+(R1*12*E*I*Math.pow(c,2))/Math.pow(L,3)    ,(R1*6*E*I*c)/Math.pow(L,2)    ,(R1*R2*12*E*I*c*s)/Math.pow(L,3)-(A*E*c*s)/L                      ,-(A*E*Math.pow(s,2))/L-(R1*R2*12*E*I*Math.pow(c,2))/Math.pow(L,3),(R1*R2*6*E*I*c)/Math.pow(L,2)],
            [-(R1*6*E*I*s)/Math.pow(L,2)                                      ,(R1*6*E*I*c)/Math.pow(L,2)                                       ,(R1*4*E*I)/L                  ,(R1*R2*6*E*I*s)/Math.pow(L,2)                                     ,-(R1*R2*6*E*I*c)/Math.pow(L,2)                                   ,(R1*R2*2*E*I)/L],
            [-(R1*R2*12*E*I*Math.pow(s,2))/Math.pow(L,3)-(A*E*Math.pow(c,2))/L,(R1*R2*12*E*I*c*s)/Math.pow(L,3)-(A*E*c*s)/L                     ,(R1*R2*6*E*I*s)/Math.pow(L,2) ,(R2*12*E*I*Math.pow(s,2))/Math.pow(L,3)+(A*E*Math.pow(c,2))/L     ,(A*E*c*s)/L-(R2*12*E*I*c*s)/Math.pow(L,3)                        ,(R2*6*E*I*s)/Math.pow(L,2)],
            [(R1*R2*12*E*I*c*s)/Math.pow(L,3)-(A*E*c*s)/L                     ,-(A*E*Math.pow(s,2))/L-(R1*R2*12*E*I*Math.pow(c,2))/Math.pow(L,3),-(R1*R2*6*E*I*c)/Math.pow(L,2),(A*E*c*s)/L-(R2*12*E*I*c*s)/Math.pow(L,3)                         ,(A*E*Math.pow(s,2))/L+(R2*12*E*I*Math.pow(c,2))/Math.pow(L,3)    ,-(R2*6*E*I*c)/Math.pow(L,2)],
            [-(R1*R2*6*E*I*s)/Math.pow(L,2)                                   ,(R1*R2*6*E*I*c)/Math.pow(L,2)                                    ,(R1*R2*2*E*I)/L               ,(R2*6*E*I*s)/Math.pow(L,2)                                        ,-(R2*6*E*I*c)/Math.pow(L,2)                                      ,(R2*4*E*I)/L]
        ];

        for (n = 1; n < (table_no_len - 1); n++) {
            j = table_no.rows[n].cells;
            if (j[0].innerHTML === p[1].innerHTML) {
                force[(n-1)*3] = Number(force[(n-1)*3]) + Number(Hi) * c - Number(Vi) * s;
                force[(n-1)*3+1] = Number(force[(n-1)*3+1]) - Number(Hi) * s + Number(Vi) * c;
                force[(n-1)*3+2] = Number(force[(n-1)*3+2]) + Number(Mi)*R1;
                linhaX=n;
            }
            if (j[0].innerHTML === p[2].innerHTML) {
                force[(n-1)*3] = Number(force[(n-1)*3]) + Number(Hf) * c - Number(Vf) * s;
                force[(n-1)*3+1] = Number(force[(n-1)*3+1]) - Number(Hf) * s + Number(Vf) * c;
                force[(n-1)*3+2] = Number(force[(n-1)*3+2]) + Number(Mf)*R2;
                linhaY=n;
            }
        }

        for (r=0;r<3;r++){
            for(t=0;t<3;t++){
                matrizGlobal[(linhaX-1)*3+r][(linhaX-1)*3+t]+=Number(matrizLocal[r][t])*apoio_status[(linhaX-1)*3+t]*apoio_status[(linhaX-1)*3+r];
                matrizGlobal[(linhaY-1)*3+r][(linhaX-1)*3+t]+=Number(matrizLocal[r+3][t])*apoio_status[(linhaX-1)*3+t]*apoio_status[(linhaY-1)*3+r];
                matrizGlobal[(linhaX-1)*3+r][(linhaY-1)*3+t]+=Number(matrizLocal[r][t+3])*apoio_status[(linhaY-1)*3+t]*apoio_status[(linhaX-1)*3+r];
                matrizGlobal[(linhaY-1)*3+r][(linhaY-1)*3+t]+=Number(matrizLocal[r+3][t+3])*apoio_status[(linhaY-1)*3+t]*apoio_status[(linhaY-1)*3+r];
            }
        }

        for (r2=0;r2<3;r2++){
            for(t2=0;t2<3;t2++){
                matrizTotal[(linhaX-1)*3+r2][(linhaX-1)*3+t2] += matrizLocal[r2][t2];
                matrizTotal[(linhaY-1)*3+r2][(linhaX-1)*3+t2] += matrizLocal[r2+3][t2];
                matrizTotal[(linhaX-1)*3+r2][(linhaY-1)*3+t2] += matrizLocal[r2][t2+3];
                matrizTotal[(linhaY-1)*3+r2][(linhaY-1)*3+t2] += matrizLocal[r2+3][t2+3];
            }
        }
    }
    gauss(matrizGlobal,force);
    for (u=3;u<(3*(table_no_len-1));u++){
        test = 0;
        for (w=3;w<(3*(table_no_len-1));w++){
            test += Number(matrizTotal[u-3][w-3])*Number(desloc_vetor[w-3]);
        }
        reacoes_result.push(test-force[u-3]);
    }
    for (i=1;i<(tabble_bar_len-1);i++) {
        p = table_bar.rows[i].cells;
        var force3 = [];
        L = Math.sqrt(Math.pow(document.getElementById('x_' + p[1].innerHTML).innerHTML - document.getElementById('x_' + p[2].innerHTML).innerHTML, 2) + Math.pow(document.getElementById('y_' + p[1].innerHTML).innerHTML - document.getElementById('y_' + p[2].innerHTML).innerHTML, 2));
        c = (document.getElementById('x_' + p[2].innerHTML).innerHTML - document.getElementById('x_' + p[1].innerHTML).innerHTML)/L;
        s = (document.getElementById('y_' + p[2].innerHTML).innerHTML - document.getElementById('y_' + p[1].innerHTML).innerHTML)/L;
        E = Number(document.getElementById('Elast'+p[0].innerHTML+'').innerHTML)*Math.pow(10,9);
        I = Number(document.getElementById('I_barra'+p[0].innerHTML+'').innerHTML)*Math.pow(10,-8);
        A = Number(document.getElementById('A_barra'+p[0].innerHTML+'').innerHTML)*Math.pow(10,-4);

        if (document.getElementById('row_dist_carga' + document.getElementById('barra' + p[0].innerHTML + '').innerHTML + '') === null) {
            Hi = 0; Vi = 0; Mi = 0; Hf = 0; Vf = 0; Mf = 0;
        } else {
            force3 = (document.getElementById('row_dist_carga' + document.getElementById('barra' + p[0].innerHTML + '').innerHTML + '').getAttribute('value')).split(',');
            Hi = (force3[0] / 2)*1000;
            Hf = (force3[0] / 2)*1000;
            Vi = ((2 * force3[2] * L + force3[3] * L) / 6)*1000;
            Vf = ((force3[2] * L + 2 * force3[3] * L) / 6)*1000;
            Mi = ((6 * force3[2] * Math.pow(L, 2) + 4 * force3[3] * Math.pow(L, 2)) / 120)*1000;
            Mf = (-(4 * force3[2] * Math.pow(L, 2) + 6 * force3[3] * Math.pow(L, 2)) / 120)*1000;
        }
        for (n = 1; n < (table_no_len - 1); n++) {
            j = table_no.rows[n].cells;
            if (j[0].innerHTML === p[1].innerHTML) {
                force[(n-1)*3] = Number(force[(n-1)*3]) + Number(Hi) * c - Number(Vi) * s;
                force[(n-1)*3+1] = Number(force[(n-1)*3+1]) - Number(Hi) * s + Number(Vi) * c;
                force[(n-1)*3+2] = Number(force[(n-1)*3+2]) + Number(Mi);
                linhaX=n;
            }
            if (j[0].innerHTML === p[2].innerHTML) {
                force[(n-1)*3] = Number(force[(n-1)*3]) + Number(Hf) * c - Number(Vf) * s;
                force[(n-1)*3+1] = Number(force[(n-1)*3+1]) - Number(Hf) * s + Number(Vf) * c;
                force[(n-1)*3+2] = Number(force[(n-1)*3+2]) + Number(Mf);
                linhaY=n;
            }
        }
        desc1=(desloc_vetor[(linhaX - 1) * 3]);
        desc2=(desloc_vetor[(linhaX - 1) * 3+1]);
        desc3=(desloc_vetor[(linhaX - 1) * 3+2]);
        desc4=(desloc_vetor[(linhaY - 1) * 3]);
        desc5=(desloc_vetor[(linhaY - 1) * 3+1]);
        desc6=(desloc_vetor[(linhaY - 1) * 3+2]);

        FHi = (((12*E*I*Math.pow(s,2))/Math.pow(L,3)+(A*E*Math.pow(c,2))/L)*desc1  +((A*E*c*s)/L-(12*E*I*c*s)/Math.pow(L,3))*desc2                      +(-(6*E*I*s)/Math.pow(L,2))*desc3 +(-(12*E*I*Math.pow(s,2))/Math.pow(L,3)-(A*E*Math.pow(c,2))/L)*desc4 +((12*E*I*c*s)/Math.pow(L,3)-(A*E*c*s)/L)*desc5                      +(-(6*E*I*s)/Math.pow(L,2))*desc6);
        FVi = (((A*E*c*s)/L-(12*E*I*c*s)/Math.pow(L,3))*desc1                      +((A*E*Math.pow(s,2))/L+(12*E*I*Math.pow(c,2))/Math.pow(L,3))*desc2  +((6*E*I*c)/Math.pow(L,2))*desc3  +((12*E*I*c*s)/Math.pow(L,3)-(A*E*c*s)/L)*desc4                      +(-(A*E*Math.pow(s,2))/L-(12*E*I*Math.pow(c,2))/Math.pow(L,3))*desc5 +((6*E*I*c)/Math.pow(L,2))*desc6);
        FMi = (-Mi + (-(6*E*I*s)/Math.pow(L,2))*desc1                              +((6*E*I*c)/Math.pow(L,2))*desc2                                     +((4*E*I)/L)*desc3                +((6*E*I*s)/Math.pow(L,2))*desc4                                     +(-(6*E*I*c)/Math.pow(L,2))*desc5                                    +((2*E*I)/L)*desc6);
        FHf = ((-(12*E*I*Math.pow(s,2))/Math.pow(L,3)-(A*E*Math.pow(c,2))/L)*desc1 +((12*E*I*c*s)/Math.pow(L,3)-(A*E*c*s)/L)*desc2                      +((6*E*I*s)/Math.pow(L,2))*desc3  +((12*E*I*Math.pow(s,2))/Math.pow(L,3)+(A*E*Math.pow(c,2))/L)*desc4  +((A*E*c*s)/L-(12*E*I*c*s)/Math.pow(L,3))*desc5                      +((6*E*I*s)/Math.pow(L,2))*desc6);
        FVf = (((12*E*I*c*s)/Math.pow(L,3)-(A*E*c*s)/L)*desc1                      +(-(A*E*Math.pow(s,2))/L-(12*E*I*Math.pow(c,2))/Math.pow(L,3))*desc2 +(-(6*E*I*c)/Math.pow(L,2))*desc3 +((A*E*c*s)/L-(12*E*I*c*s)/Math.pow(L,3))*desc4                      +((A*E*Math.pow(s,2))/L+(12*E*I*Math.pow(c,2))/Math.pow(L,3))*desc5  +(-(6*E*I*c)/Math.pow(L,2))*desc6);
        FMf = (-Mf + (-(6*E*I*s)/Math.pow(L,2))*desc1                              +((6*E*I*c)/Math.pow(L,2))*desc2                                     +((2*E*I)/L)*desc3                +((6*E*I*s)/Math.pow(L,2))*desc4                                     +(-(6*E*I*c)/Math.pow(L,2))*desc5                                    +((4*E*I)/L)*desc6);

        FHinicial = Hi + FHi*c + FVi*s;
        FVinicial = -Vi - FHi*s + FVi*c;
        FMinicial = FMi;
        FHfinal = Hf - FHf*c - FVf*s;
        FVfinal = -Vf - FHf*s + FVf*c;
        FMfinal = FMf;

        normal_result.push(FHinicial, FHfinal);
        cortant_result.push(FVinicial,FVfinal);
        momento_result.push(FMinicial, FMfinal);
    }
    insert_results(desloc_vetor,reacoes_result,normal_result,cortant_result,momento_result);
}
function array_fill(i, n, v) {
    var a = [];
    for (; i < n; i++) {
        a.push(v);
    }
    return a;
}
function gauss(A, x) {
    var i, k, j;
    // Acrescenta vetor força a matriz de rigidez global
    for (i=0; i < A.length; i++) {
        A[i].push(x[i]);
    }
    var n = A.length;
    for (i=0; i < n; i++) {
        // Procura os valores máximos em cada coluna e salva
        var maxEl = Math.abs(A[i][i]),
            maxRow = i;
        for (k=i+1; k < n; k++) {
            if (Math.abs(A[k][i]) > maxEl) {
                maxEl = Math.abs(A[k][i]);
                maxRow = k;
            }
        }
        // Substitui valores máximos da linha em cada coluna
        for (k=i; k < n+1; k++) {
            var tmp = A[maxRow][k];
            A[maxRow][k] = A[i][k];
            A[i][k] = tmp;
        }
        // Atribui valor 0 a linhas anteriores a A[i][i] e ajusta os demais com o fator de correção
        for (k=i+1; k < n; k++) {
            p = A[i][i];
            if(p!==0) {
                var c = -A[k][i] / A[i][i];
                for (j = i; j < n + 1; j++) {
                    if (i === j) {
                        A[k][j] = 0;
                    } else {
                        A[k][j] += c * A[i][j];
                    }
                }
            }
        }
    }
    // Resolução do sistema de equações Global F=K*d
    x = array_fill(0, n, 0);
    for (i=n-1; i > -1; i--) {
        p = A[i][i];
        if(p!==0) {
            x[i] = A[i][n] / A[i][i];
            for (k = i - 1; k > -1; k--) {
                A[k][n] -= A[k][i] * x[i];
            }
        }
    }
    desloc_vetor=x;
}
function insert_results(d,r,norm,cort,mom){
    var table_no = document.getElementById('data_table_no');
    var table_no_len = table_no.rows.length-1;
    var table_bar = document.getElementById('data_table_barra');
    var tabble_bar_len = table_bar.rows.length;
    var table_desloc=document.getElementById('desloc_results');
    var table_reacoes=document.getElementById('reacoes_results');
    var table_normal=document.getElementById('normais_results');
    var table_cortant=document.getElementById('cortant_results');
    var table_moment=document.getElementById('moment_results');

    table_desloc.innerHTML="";
    table_desloc.insertRow(0).innerHTML = "<tr><th class='text-center'>Nó</th><th class='text-center'>dx</th><th class='text-center'>dy</th><th class='text-center'>dz</th></tr>"
    for (n=1;n<table_no_len;n++) {
        var x = document.getElementById("data_table_no").rows[n].cells;
        table_desloc.insertRow(n).innerHTML = "<tr><td class='text-center'>"+x[0].innerHTML+"</td>"+
            "<td id='dx"+x[0].innerHTML+"' value='"+Number(d[(n-1)*3])+"' class='text-center'>"+(Number((d[(n-1)*3]).toFixed(10))).toExponential(3)+"</td>"+
            "<td id='dy"+x[0].innerHTML+"' value='"+Number(d[(n-1)*3+1])+"' class='text-center'>"+(Number((d[(n-1)*3+1]).toFixed(10))).toExponential(3)+"</td>"+
            "<td id='dz"+x[0].innerHTML+"' value='"+Number(d[(n-1)*3+2])+"' class='text-center'>"+(Number((d[(n-1)*3+2]).toFixed(10))).toExponential(3)+"</td></tr>"
    }
    table_reacoes.innerHTML="";
    table_reacoes.insertRow(0).innerHTML = "<tr><th class='text-center'>Nó</th><th class='text-center'>Rx</th><th class='text-center'>Ry</th><th class='text-center'>Mz</th></tr>"
    for (n=1;n<table_no_len;n++) {
        var x = document.getElementById("data_table_no").rows[n].cells;
        table_reacoes.insertRow(n).innerHTML = "<tr><td class='text-center'>"+x[0].innerHTML+"</td>"+
            "<td id='rx"+x[0].innerHTML+"' value='"+Number(r[(n-1)*3])+"' class='text-center'>"+Number((r[(n-1)*3]).toFixed(10)).toExponential(3)+"</td>"+
            "<td id='ry"+x[0].innerHTML+"' value='"+Number(r[(n-1)*3])+"' class='text-center'>"+Number((r[(n-1)*3+1]).toFixed(10)).toExponential(3)+"</td>"+
            "<td id='rz"+x[0].innerHTML+"' value='"+Number(r[(n-1)*3])+"' class='text-center'>"+Number((r[(n-1)*3+2]).toFixed(10)).toExponential(3)+"</td></tr>"
    }
    table_normal.innerHTML="";
    table_normal.insertRow(0).innerHTML = "<tr><th class='text-center'>Barra</th><th class='text-center'>Ni</th><th class='text-center'>Nf</th></tr>"
    for (n=1;n<(tabble_bar_len-1);n++) {
        var x = document.getElementById("data_table_barra").rows[n].cells;
        table_normal.insertRow(n).innerHTML = "<tr><td class='text-center'>"+x[0].innerHTML+"</td>"+
            "<td class='text-center'>"+Number((norm[2*n-2]).toFixed(10)).toExponential(3)+"</td>"+
            "<td class='text-center'>"+Number((norm[2*n-1]).toFixed(10)).toExponential(3)+"</td></tr>"
    }
    table_cortant.innerHTML="";
    table_cortant.insertRow(0).innerHTML = "<tr><th class='text-center'>Barra</th><th class='text-center'>Ni</th><th class='text-center'>Nf</th></tr>"
    for (n=1;n<(tabble_bar_len-1);n++) {
        var x = document.getElementById("data_table_barra").rows[n].cells;
        table_cortant.insertRow(n).innerHTML = "<tr><td class='text-center'>"+x[0].innerHTML+"</td>"+
            "<td class='text-center'>"+Number((cort[2*n-2]).toFixed(10)).toExponential(3)+"</td>"+
            "<td class='text-center'>"+Number((cort[2*n-1]).toFixed(10)).toExponential(3)+"</td></tr>"
    }
    table_moment.innerHTML="";
    table_moment.insertRow(0).innerHTML = "<tr><th class='text-center'>Barra</th><th class='text-center'>Ni</th><th class='text-center'>Nf</th></tr>"
    for (n=1;n<(tabble_bar_len-1);n++) {
        var x = document.getElementById("data_table_barra").rows[n].cells;
        table_moment.insertRow(n).innerHTML = "<tr><td class='text-center'>"+x[0].innerHTML+"</td>"+
            "<td class='text-center'>"+Number((mom[2*n-2]).toFixed(10)).toExponential(3)+"</td>"+
            "<td class='text-center'>"+Number((mom[2*n-1]).toFixed(10)).toExponential(3)+"</td></tr>"
    }
}
