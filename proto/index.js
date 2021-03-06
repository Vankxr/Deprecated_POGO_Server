//Libraries
const protobuf = require('protobufjs');

//Proto build
const builder = protobuf.newBuilder();
protobuf.loadProtoFile(__dirname + '/POGOProtos.proto', builder);

// Recursively add the packed=true option to all packable repeated fields.
// Repeated fields are packed by default in proto3 but protobuf.js incorrectly does not set the option.
// See also: https://github.com/dcodeIO/protobuf.js/issues/432
function addPackedOption(ns) {
    if (ns instanceof protobuf.Reflect.Message) {
        ns.getChildren(protobuf.Reflect.Field).forEach(field => {
            if (field.repeated && protobuf.PACKABLE_WIRE_TYPES.indexOf(field.type.wireType) != -1) {
                field.options.packed = true;
            }
        });
    } else if (ns instanceof protobuf.Reflect.Namespace) {
        ns.children.forEach(addPackedOption);
    }
}

addPackedOption(builder.lookup('POGOProtos'));

//Build
const protos = builder.build("POGOProtos");

//Export
module.exports = protos;