import {input} from "./in.js";

class Neuron {
    constructor(id, x, y, isInput) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.isInput = isInput;
    }
}

let rect = "<rect x=\"%x\" y=\"%y\" width=\"30\" height=\"30\" fill=\"#C4C4C4\"/>";
let circle = "<circle cx=\"%cx\" cy=\"%cy\" r=\"15\" fill=\"#C4C4C4\"/>";
let line = "<line x1=\"%x1\" y1=\"%y1\" x2=\"%x2\" y2=\"%y2\" stroke=\"black\"/>";


class Sips {
    constructor(id, weight, inner, outer) {
        this.id = id;
        this.weight = weight;
        this.inner = inner;
        this.outer = outer;
    }
}


class Net {
    constructor(id) {
        this.id = id;
        this.data = [];
    }
}


function f() {
    let strings = input.replaceAll("/", "").split(">")
    let net = new Net(get_params(strings[0], "ид"))
    strings[0] = ""
    strings[strings.length - 1] = ""
    let data = []
    for (const stringsKey of strings) {
        if (stringsKey === "") continue
        if (stringsKey.indexOf("нейрон") !== -1) {
            let coordunates = get_params(stringsKey, "координаты").split(";")
            let x, y
            x = coordunates[0]
            y = coordunates[1]
            let n = new Neuron(get_params(stringsKey, "ид"), x, y, find_params(stringsKey, "вх_файл"));
            data.push(n)
        }
        if (stringsKey.indexOf("синапс") !== -1) {
            let s = new Sips(get_params(stringsKey, "ид"), get_params(stringsKey, "вес"),
                get_params(stringsKey, "приемник"), get_params(stringsKey, "передатчик"));
            data.push(s)
        }
    }
    net.data = data
    return pars_svg(net)
}

function format_params(str) {
    let mass = str.replace("<","").split(" ")
    let data = new Map()
    let temp = []
    // console.log(mass)
    for (let i = 0; i < mass.length; i++) {
        if (mass[i].indexOf("=") === -1) {
            continue
        }
        temp.push(mass[i])
    }
    for (let i = 0; i < temp.length; i++) {
        data.set(temp[i].split("=")[0], temp[i].split("=")[1])
    }
    return data
}


function get_params(str, tag) {
    return format_params(str).get(tag)
}

function find_params(str, tag) {
    return format_params(str).has(tag)
}

function find_neur(net, id){
    for (let neur of net.data){
        if (neur instanceof Neuron){
            if (neur.id === id) return neur
        }
    }
}

function pars_svg(net){
    let max_x = 0, max_y = 0
    let strs = []
    console.log(net)
    for (let data of net.data) {
        if (data instanceof Neuron){
            max_x = Math.max(data.x, max_x)
            max_y = Math.max(data.y, max_y)

            if (data.isInput) strs.push(rect.replace("%x", data.x).replace("%y", data.y))
            else strs.push(circle.replace("%cx", parseInt(data.x)+15).replace("%cy", parseInt(data.y)+15))
        }
        else if (data instanceof Sips){
            let inner = find_neur(net, data.inner), outer = find_neur(net, data.outer)
            if (inner.x === outer.x) {
                const x = parseInt(inner.x)+15
                let in_y = parseInt(inner.y), out_y = parseInt(outer.y)
                if (inner.y > outer.y) {
                    in_y += 30
                } else {
                    out_y += 30
                }
                strs.push(line.replace("%x1", x).replace("%x2", x).replace("%y1", in_y).replace("%y2", out_y))
            } else {
                let in_y = parseInt(inner.y)+15, out_y = parseInt(outer.y)+15
                let in_x = parseInt(inner.x), out_x = parseInt(outer.x)
                if (inner.x > outer.x) {
                    out_x += 30
                } else {
                    in_x += 30
                }
                strs.push(line.replace("%y1", in_y).replace("%y2", out_y).replace("%x1", in_x).replace("%x2", out_x))
            }
        }
    }
    return create_svg(strs,max_x+30*2, max_y+30*2)
}

function create_svg(strings, w, h){
    let svg = "<svg width=\""+w+"\" height=\""+h+"\" viewBox=\"0 0 "+w+" "+h+"\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">"
    for (const string of strings) {
        svg += "\n"
        svg += string
    }
    svg += "</svg>"
    return svg;
}

console.log(f())
//console.log(create_svg(["<rect width=\"28\" height=\"28\" fill=\"#C4C4C4\"/>", "<rect y=\"55\" width=\"28\" height=\"28\" fill=\"#C4C4C4\"/>"], 100, 100))

