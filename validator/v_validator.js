/**
 * Created by monty on 21/05/15.
 */



    exports.addressSchema = {
        "id": "/Address",
        "type": "object",
        "properties": {
            "street": {"type": "string"},
            "number": {"type": "integer"},
            "city": {"type": "string"},
            "post_code": {"type": "string"},
            "floor": {"type": "integer"},
            "door": {"type": "string"}
        },
        "required": ["street", "number", "city", "post_code"]
    };


    exports.customerSchema = {
        "id": "/Customer",
        "type": "object",
        "properties": {
            "name": {"type": "string"},
            "email": {"type": "string"},
            "password": {"type": "string"},
            "phone_number": {"type": "string"}
        }
    };


    exports.businessSchema = {
        "id": "/Business",
        "type": "object",
        "properties": {
            "name": {"type": "string"},
            "email": {"type": "string"},
            "password": {"type": "string"},
            "description": {"type": "string"},
            "phone_number": {"type": "string"},
            "facebook_link": {"type": "string"}
        }
    };


    exports.chargeSchema = {
        "id": "/Charge",
        "type": "object",
        "properties": {
           "lines":{
                "type":"array",
                "items":{"$ref":"/Charge_Line"}
            },
            "total_price": {"type": "float"},
            "status": {"type": "string"},
            "start_time": {"type": "date"},
            "finish_time": {"type": "date"},
            "home_deliveri": {"type": "boolean"}
        }
    };

    exports.charge_lineSchema = {
        "id": "/Charge_Line",
        "type": "object",
        "properties": {
            "quantity": {"type": "float"},
            "price": {"type": "float"},
            "productId":{"type":"integer"}
        }
    };

    exports.categorySchema = {
        "id": "/Category",
        "type": "object",
        "properties": {
            "name": {"type": "string"},
            "def": {"type": "string"}
        }
    };

    exports.productSchema = {
        "id": "/Product",
        "type": "object",
        "properties": {
            "name": {"type": "string"},
            "units": {"type": "string"},
            "unit_price": {"type": "float"},
            "seasonal": {"type": "boolean"},
            "description": {"type": "string"}
        }
    };

    exports.newChargeSchema = {
        "id": "/newCharge",
        "type":"object",
        "properties":{
            "lines":{
                "type":"array",
                "items":{"$ref":"/Charge_Line"}
            },
            "total_price": {"type": "float"},
            "status": {"type": "string"},
            "start_time": {"type": "date"},
            "finish_time": {"type": "date"},
            "home_deliveri": {"type": "boolean"},
            "businessId":{"type":"integer"},
            "addressId":{"type":"integer"}
        }
    };
