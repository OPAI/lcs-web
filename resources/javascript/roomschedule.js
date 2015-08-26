function processReservation(url) {
    var doc = new XMLHttpRequest()
    doc.onreadystatechange = function() {
        if(doc.readyState === XMLHttpRequest.DONE) {
            if (doc.status === 200) {
                var rx = /<td>Sala:<\/td>(.|[\n\r])*?<td>Lab. de Informática - Lab. (.*)<\/td>/g
                var c = rx.exec(doc.responseText)
                if (c == null) {
                    rx = /<td>Sala:<\/td>(.|[\n\r])*?Metalurgia - LAB (.)/g
                    c = rx.exec(doc.responseText)
                    if (c == null)
                        return
                }
                var lab = c[2]
                rx = /<td>Hora Início:<\/td>(.|[\n\r])*?<td>(.*) - /g
                c = rx.exec(doc.responseText)
                var startTime = c[2]
                rx = /<h3>((.|[\n\r])*?)<\/h3>/g
                c = rx.exec(doc.responseText)
                var title = c[1].replace('\n', '').replace('\r', '')
                rx = /<td>Hora Fim:<\/td>(.|[\n\r])*?<td>(.*) - /g
                c = rx.exec(doc.responseText)
                var endTime = c[2]
                rx = /<td>Descrição:<\/td>(.|[\n\r])*?<td>(.*)<\/td>/g
                c = rx.exec(doc.responseText)
                var description = c[2]
                var nowInt = parseInt(Qt.formatDateTime(new Date(), "HHmmss"))
                var startTimeInt = parseInt(startTime.replace(":", "").replace(":", ""))
                var endTimeInt = parseInt(endTime.replace(":", "").replace(":", ""))
                if (startTimeInt <= nowInt && nowInt < endTimeInt) {
                    if (title != description) {
                        nowHappeningView.children[lab-1].children[0].children[1].text = title + " - " + description
                        nowHappeningView.children[lab-1].children[0].children[2].text = startTime + " às " + endTime
                    }
                    else {
                        nowHappeningView.children[lab-1].children[0].children[1].text = title
                        nowHappeningView.children[lab-1].children[0].children[2].text = startTime + " às " + endTime
                    }
                }
                else {
                    if (startTimeInt > nowInt &&
                            (toHappenView.children[lab-1].children[0].children[2].text == "" ||
                            parseInt(toHappenView.children[lab-1].children[0].children[2].text.replace(":", "").replace(":", "")) > startTimeInt)) {
                        if (title != description) {
                            toHappenView.children[lab-1].children[0].children[1].text = title + " - " + description
                            toHappenView.children[lab-1].children[0].children[2].text = startTime
                        }
                        else {
                            toHappenView.children[lab-1].children[0].children[1].text = title
                            toHappenView.children[lab-1].children[0].children[2].text = startTime
                        }
                    }
                }
            }
            else {
                console.log("Status: " + doc.status + ", Status Text: " + doc.statusText)
            }
        }
    }
    doc.open("GET", "http://www.salas.ifba.edu.br/" + url)
    doc.send()
}

function processArea(area) {
    var timeslot = []
    timeslot[0] = 700; timeslot[1] = 750; timeslot[2] = 840
    timeslot[3] = 930; timeslot[4] = 1020; timeslot[5] = 1110
    timeslot[6] = 1200; timeslot[7] = 1250; timeslot[8] = 1340
    timeslot[9] = 1430; timeslot[10] = 1520; timeslot[11] = 1610
    timeslot[12] = 1700; timeslot[13] = 1750; timeslot[14] = 1840
    timeslot[15] = 1930; timeslot[16] = 2020; timeslot[17] = 2110; timeslot[18] = 2200
    for (var i = 0; i < 5; ++i) {
        nowHappeningView.children[i].children[0].children[1].text = ""
        nowHappeningView.children[i].children[0].children[2].text = ""
        toHappenView.children[i].children[0].children[1].text = ""
        toHappenView.children[i].children[0].children[2].text = ""
    }

    var nowDate = new Date();
    var now = parseInt(Qt.formatDateTime(nowDate, "HHmm"))
    for (var i = 0; i < 18; ++i)
        if (timeslot[i] < now && now < timeslot[i+1])
            break
    if (i == 18) return
    i = 12;
    var doc = new XMLHttpRequest()
    doc.onreadystatechange = function() {
        if(doc.readyState === XMLHttpRequest.DONE) {
            if (doc.status === 200) {
                var rx = /(view_entry.*?)\"/g
                var c = rx.exec(doc.responseText)
                console.log(c+"<<<")
                while (c) {
                    processReservation(c[1])
                    //if (c!== null)
                    c = rx.exec(doc.responseText)
                    console.log(">>>"+c+"<<<")
                }
            }
            else {
                console.log("Status: " + doc.status + ", Status Text: " + doc.statusText)
            }
        }
    }

    doc.open("GET", "http://www.salas.ifba.edu.br/day.php?year=" + Qt.formatDateTime(nowDate, "yyyy") + "&month=" + Qt.formatDateTime(nowDate, "M") + "&day=" + Qt.formatDateTime(nowDate, "dd") + "&area=" + area)
    doc.send()
}

function loadRoomSchedule() {
    processArea(4)
    processArea(16)
}
