use stu_1601321003

var addTruck = function(item) {
    if(!item.model) {
        print('the truck needs to have a model my dude');
        return;
    }
    if(!item.warehouseId)
    {
        print('the truck needs to have a warehouseId my man');
        return;
    }

    db.trucks.insert({model: item.model, warehouseId: item.warehouseId});
};

addTruck({model: 'BMW', warehouseId: '65sd6s5d'});
var insert5 = function() {
    const models = ['BMW', 'AUDI', 'MOSKVICH', 'TRABANT', 'LAMBORGINI'];
    models.forEach(model => {
        addTruck({model: model, warehouseId: Math.random().toString(36).substring(5)});
    });
};

var putSomeSeatsOnThem = function() {
    const result = db.trucks.find();
    result.forEach(truck => {
        truck.seats = Math.floor(Math.random() * 3 + 2);
        db.trucks.update({_id: truck._id}, truck);
    });
};

var inserCargo = function(cargo) {
    const required = ['name', 'category', 'amount', 'truckId'];
    let willSave = true;
    required.forEach(field => {
        if(!cargo[field]) {
            print('Cargo needs to have ' + field);
            willSave = false;
        }
    });

    const truck = db.trucks.find({_id: cargo.truckId}).next();

    if(!truck) {
        print('this is not the truck you are looking for');
        return;
    }

    if(willSave) {
        db.cargos.insert(cargo);
    }
};

var insertSomeCargos = function() {
    const cargoNames = ['Banana', 'Coal', 'Petrol', 'Refugees', 'The Dark Side'];
    const cargoType = ['fruits', 'energy', 'energy', 'meat',  'darkness'];
    
    const trucks = db.trucks.find();
    for(let i = 0; i < 5; i++) {
        inserCargo({name: cargoNames[i], category: cargoType[i], amount: Math.floor(Math.random() * 1000), truckId: trucks.next()._id});
    }
};

var showSomeGoodTrucks = function() {
    const trucks = db.trucks.find();
    const trucksToDisplay = [];
    trucks.forEach(truck => {
        const cargos = db.cargos.find({truckId: truck._id});
        truck.cargos = cargos.toArray();
        trucksToDisplay.push(truck);
    });

    trucksToDisplay.forEach(printjson);
};

var filterPriorityCargo = function() {
    const priorityCargos = db.cargos.find({$or: [
        {category: 'fruits'},
        {category: 'vegetables'},
        {category: 'meat'},
        {category: 'milk and dairy'}
    ]});

    priorityCargos.forEach(cargo => {
        db.priorityCargos.insert(cargo);
    });
};

addTruck({model: 'BMW', warehouseId: '65sd6s5d'});
var insert5 = function() {
    const models = ['BMW', 'AUDI', 'MOSKVICH', 'TRABANT', 'LAMBORGINI'];
    models.forEach(model => {
        addTruck({model: model, warehouseId: Math.random().toString(36).substring(5)});
    });
};

var putSomeSeatsOnThem = function() {
    const result = db.trucks.find();
    result.forEach(truck => {
        truck.seats = Math.floor(Math.random() * 3 + 2);
        db.trucks.update({_id: truck._id}, truck);
    });
};

var inserCargo = function(cargo) {
    const required = ['name', 'category', 'amount', 'truckId'];
    const priorityCategory = ['meat', 'fruits', 'vegetables', 'milk and dairy'];

    let willSave = true;
    required.forEach(field => {
        if(!cargo[field]) {
            print('Cargo needs to have ' + field);
            willSave = false;
        }
    });

    const truck = db.trucks.find({_id: cargo.truckId}).next();

    if(!truck) {
        print('this is not the truck you are looking for');
        return;
    }

    if(willSave) {
        db.cargos.insert(cargo);
        priorityCategory.forEach(priorityCategory => {
            if(cargo.category === priorityCategory) {
                db.priorityCargos.insert(cargo);
            }
        });
    }
};