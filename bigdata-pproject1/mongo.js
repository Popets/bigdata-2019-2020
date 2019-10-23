var validateEmployee = function (employee) {
    const validationFields = ['fname', 'lname', 'address', 'phone', 'email', 'job', 'department', 'salary', 'country'];
    validationFields.forEach(field => {
        if (!employee[field]) {
        print('employee ' + field + ' is required');
        return false;
    }
    });

    if (employee.salary <= 0) {
        print('employee salary needs to be iconomically viable');
        return false;
    }

    if(employee.manager && employee.manager === employee._id){
        print('you cant be your own boss');
        return false;
    }

    if (employee.manager && !db.employees.findOne({ _id: employee.manager })) {
        print('there is no such employee to be your manager');
        return false;
    }

    return true;
}

var validateCustomer = function (customer) {
    const validationFields = ['fname', 'lname', 'address', 'phone', 'email']

    validationFields.forEach(field => {
        if (!customer[field]) {
            print('customer ' + field + ' is required');
            return false;
        }
    });

    if (!customer.accounts || customer.accounts.length < 1) {
        print('customer must have atleast 1 account');
        return false;
    }

    const accountNames = [];

    let duplicate = false;

    customer.accounts.forEach(account => {
        if (accountNames.includes(account.name)) {
            print('duplicate account: ' + account.name);
            duplicate = true;
        }

        accountNames.push(account.name);
    })

    if (duplicate) {
        print('we failed validating customer');
        return false;
    } else {
        return true;
    }
}

var dbw = {
    employees: any = {
        insert: function (employee) {
            if (!validateEmployee(employee)) {
                return;
            }

            employee.startDate = new Date();

            const result = db.employees.insertOne(employee);

            db.department_changes.insert({employee: result.insertedId, department: employee.department, date: new Date()});
        },

        update: function (employee) {
            if (!validateEmployee(employee)) {
                return;
            }

            const currentEmployee = db.employees.findOne({ _id: employee._id });

            if (!currentEmployee) {
                print('this is not the employee youre looking for');
                return;
            }

            if(currentEmployee.department !== employee.department) {
                db.department_changes.insert({employee: employee._id, department: employee.department, date: new Date()});
            }

            db.employees.update({_id: employee._id},employee);
        }
    },
    customers: any = {
        insert: function (customer) {
            if (!validateCustomer(customer)) {
                return;
            }

            let insert = true;
            const result =
                customer.accounts.forEach(account => {
                    const result = db.customers.find({ 'accounts.name': account.name });

                    if (result.length > 0) {
                    print('account ' + account.name + ' already exists');
                    insert = false;
                    }
                });
            if(insert) {
                db.customers.insert(customer);
            }
        },
        update: function (customer) {
            if (!validateCustomer(customer)) {
                return;
            }

            if (!db.customers.findOne({ _id: customer._id })) {
                print('this is not the customer youre looking for');
                return;
            }

            const update = true;

            customer.accounts.forEach(account => {
                if (!account.currency) {
                    account.currency = 'BGN';
                }

                const result = db.customers.find({ 'accounts.name': account.name }).next();

                if (result && !result._id.equals(customer._id)) {
                    print('we are here')
                    print('account ' + account.name + ' does not belong to you');
                    update = false;
                    return;
                }
            });

            if (update) {
                db.customers.update({_id: customer._id}, customer);
            }
        }
    }
};

var generateRandomEmployee = function (number) {
    const fnames = ['Lili', 'Vanka', 'Peca', 'Stasi', 'Rocky'];
    const lnames = ['Mihova', 'Nikolov', 'Minchev', 'Kanev', 'Balboa'];
    const addresses = ['9746 Lees Creek Lane Trussville, AL 35173', '9746 Vale St. Brunswick, GA 31525', '686 53rd Dr. Marshalltown, IA 50158', '9047 Winchester Dr. Mcallen, TX 78501'];
    const jobs = ['Cleaner', 'Smugler', 'Warlord', 'Goblin', 'Assasin', 'God'];
    const departments = ['Assasination', 'HR', 'Engeneering', 'Mind Benders', 'Rats'];
    const emailNames = ['0godSlayer', 'edgeMaster', 'fightStarter', 'maniac42', 'pickle'];
    const emailDoms = ['nest.org', 'rice.com', 'water.com', 'invasion.ru', 'help.se'];
    const countries = ['DO', 'EG', 'JO', 'LY', 'MA'];

    for (let i = 0; i < number; i++) {
        const employee = {
            fname: fnames[Math.floor(Math.random() * fnames.length)],
            lname: lnames[Math.floor(Math.random() * lnames.length)],
            address: addresses[Math.floor(Math.random() * addresses.length)],
            job: jobs[Math.floor(Math.random() * jobs.length)],
            department: departments[Math.floor(Math.random() * departments.length)],
            email: (emailNames[Math.floor(Math.random() * emailNames.length)] + '@' + emailDoms[Math.floor(Math.random() * emailDoms.length)]),
            country: countries[Math.floor(Math.random() * countries.length)],
            phone: Math.random().toString().slice(2, 11),
            salary: Math.floor(Math.random() * 1001),
            mname: lnames[Math.floor(Math.random() * lnames.length)]
        }

        const iterator = db.employees.aggregate([{ $sample: { size: 1 } }]);
        if (iterator.hasNext() && Math.floor(Math.random() * 10) < 9) {
            employee.manager = iterator.next()._id;
        }

        dbw.employees.insert(employee);
    }
};

generateRandomEmployee(6)

var generateRandomCustomer = function (number) {
    const fnames = ['Lili', 'Vanka', 'Peca', 'Stasi', 'Rocky'];
    const lnames = ['Mihova', 'Nikolov', 'Minchev', 'Kanev', 'Balboa'];
    const addresses = ['9746 Lees Creek Lane Trussville, AL 35173', '9746 Vale St. Brunswick, GA 31525', '686 53rd Dr. Marshalltown, IA 50158', '9047 Winchester Dr. Mcallen, TX 78501'];
    const emailNames = ['0godSlayer', 'edgeMaster', 'fightStarter', 'maniac42', 'pickle'];
    const emailDoms = ['nest.org', 'rice.com', 'water.com', 'invasion.ru', 'help.se'];
    const currencies = ['CAD', 'HRK', 'RON', 'PHP', 'PEN'];

     for (let i = 0; i < number; i++) {
        const customer = {
            fname: fnames[Math.floor(Math.random() * fnames.length)],
            lname: lnames[Math.floor(Math.random() * lnames.length)],
            address: addresses[Math.floor(Math.random() * addresses.length)],
            email: (emailNames[Math.floor(Math.random() * emailNames.length)] + '@' + emailDoms[Math.floor(Math.random() * emailDoms.length)]),
            phone: Math.random().toString().slice(2, 11),
            mname: lnames[Math.floor(Math.random() * lnames.length)]
        }

        accounts = [];
        for(let j = 0; j < Math.floor(Math.random() * 10) + 1; j++) {
            const account = {
                name: Math.random().toString(36).substring(5),
                ammount: Math.floor(Math.random() * 10001),
                currency: currencies[Math.floor(Math.random() * fnames.length)]
            };

            accounts.push(account);
        }

        customer.accounts = accounts;

        dbw.customers.insert(customer);
     }
};

generateRandomCustomer(6)


//QUERIES PART 1

//1
var findAllDepartments = function () {
    const result = db.employees.distinct('department');

    result.forEach(employee => {
        print(employee);
    });
};

findAllDepartments()

//2
var getSalaryList = function () {
    const result = db.employees.find();
    result.forEach(employee => {
        print(employee.fname + ' ' + employee.lname + ': ' + employee.salary)
    });
};

getSalaryList()

//3
var getCompanyEmails = function() {
    const result = db.employees.find();
    result.forEach(employee => {
        print(employee.fname + ' ' + employee.lname + ': ' + employee.fname.toLowerCase() + '.' + employee.lname.toLowerCase() + '@bankoftomarow.bg');
    });
};

getCompanyEmails()

//4
var getOldEmployees = function () {
    const date = new Date();
    date.setFullYear(date.getFullYear() -5);
    const result = db.employees.find({startDate: {$lte: date}});
    result.forEach(employee => {
        print(employee.fname + ' ' + employee.lname)
    });
};

var setOneManToWorkForMoreYears = function () {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 6);
    const result = db.employees.aggregate([{ $sample: { size: 1 } }]).next();
    result.startDate = date;
    db.employees.update({_id: result._id}, result);
};

setOneManToWorkForMoreYears()
getOldEmployees()

// 5
var getEmployeesStartingWithS = function () {
    const result = db.employees.find({fname: {$regex: /^S/}})
    result.forEach(employee => {
        print(employee.fname + ' ' + employee.lname)
    });
};

getEmployeesStartingWithS()

// 6
var getIllegalAliens = function () {
    const result = db.employees.find({country: {$ne: 'BG'}});
    result.forEach(employee => {
        print(employee.fname + ' ' + employee.lname)
    });
};

getIllegalAliens()

//7
var getLnames = function () {
    const result = db.employees.find({$or: [{fname: {$regex: /l/}}, {mname: {$regex: /l/}}, {lname: {$regex: /l/}}]});
    result.forEach(employee => {
        print(employee.fname + ' '  + employee.mname +' '+ employee.lname)
    });
};

getLnames()


//QUERIES PART 2

//1
db.employees.remove({})

generateRandomEmployee(20)

db.department_changes.find()

//2
var getFrequentChangers = function () {
  let dateTwoMonthsAgo = new Date();
    dateTwoMonthsAgo.setMonth(dateTwoMonthsAgo.getMonth() - 2);

    const result = db.department_changes.aggregate([
        {
            $match: {
                date: {$gte: dateTwoMonthsAgo}
            }
        },
        {
            $group: {
                _id: '$employee',
                count: {$sum:1},
            }
        }
        ]);
    result.forEach(departmentChange => {
        if(departmentChange.count >= 2) {
            const employee = db.employees.find({_id: departmentChange._id}).next();
            print(employee.fname + ' ' + employee.lname);
        }
    });
};

var moveSingleEmployee = function () {
    const employee = db.employees.aggregate([{ $sample: { size: 1 } }]).next();
    employee.department = 'NO';
    dbw.employees.update(employee);
};

moveSingleEmployee()

getFrequentChangers()

//3
var getTheSolidEmployees = function () {

    const result = db.department_changes.aggregate([
        {
            $group: {
                _id: '$employee',
                count: {$sum:1},
            }
        }
    ])
    result.forEach(departmentChange => {
        if(departmentChange.count === 1) {
            const employee = db.employees.find({_id: departmentChange._id}).next();
            print(employee.fname + ' ' + employee.lname);
        }
    });
};

getTheSolidEmployees()

//QUERIES PART 3 (why'd you do this?)
var validateEmployee = function (employee) {
    const validationFields = ['fname', 'lname', 'address', 'phone', 'email', 'job', 'department', 'salary', 'country', 'status'];
    validationFields.forEach(field => {
        if (!employee[field]) {
            print('employee ' + field + ' is required');
            return false;
        }
    });

    if (employee.salary <= 0) {
        print('employee salary needs to be iconomically viable');
        return false;
    }

    if(employee.manager && employee.manager === employee._id){
        print('you cant be your own boss');
        return false;
    }

    if (employee.manager && !db.employees.findOne({ _id: employee.manager })) {
        print('there is no such employee to be your manager');
        return false;
    }

    return true;
};

var generateRandomCustomer = function (number) {
    const fnames = ['Lili', 'Vanka', 'Peca', 'Stasi', 'Rocky'];
    const lnames = ['Mihova', 'Nikolov', 'Minchev', 'Kanev', 'Balboa'];
    const addresses = ['9746 Lees Creek Lane Trussville, AL 35173', '9746 Vale St. Brunswick, GA 31525', '686 53rd Dr. Marshalltown, IA 50158', '9047 Winchester Dr. Mcallen, TX 78501'];
    const emailNames = ['0godSlayer', 'edgeMaster', 'fightStarter', 'maniac42', 'pickle'];
    const emailDoms = ['nest.org', 'rice.com', 'water.com', 'invasion.ru', 'help.se'];
    const currencies = ['CAD', 'HRK', 'RON', 'PHP', 'PEN'];
    const statuses = ['dying', 'wounded', 'multiplying', 'deleted from existance']

    for (let i = 0; i < number; i++) {
        const customer = {
            fname: fnames[Math.floor(Math.random() * fnames.length)],
            lname: lnames[Math.floor(Math.random() * lnames.length)],
            address: addresses[Math.floor(Math.random() * addresses.length)],
            email: (emailNames[Math.floor(Math.random() * emailNames.length)] + '@' + emailDoms[Math.floor(Math.random() * emailDoms.length)]),
            phone: Math.random().toString().slice(2, 11),
            mname: lnames[Math.floor(Math.random() * lnames.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)]
        }

        accounts = [];
        for(let j = 0; j < Math.floor(Math.random() * 10) + 1; j++) {
            const account = {
                name: Math.random().toString(36).substring(5),
                ammount: Math.floor(Math.random() * 10001),
                currency: currencies[Math.floor(Math.random() * fnames.length)]
            };

            accounts.push(account);
        }

        customer.accounts = accounts;

        dbw.customers.insert(customer);
    }
};

var updateStatusesForEmployees = function () {
    const statuses = ['dying', 'wounded', 'multiplying', 'deleted from existance']
    const result = db.employees.find();
    result.forEach(employee => {
        employee.status = statuses[Math.floor(Math.random() * statuses.length)];
        dbw.employees.update(employee);
    })
};

updateStatusesForEmployees()

//1
var getQuoteQuoteFiredQuoteQuotePeople = function () {
    const employees = db.employees.find({status: 'deleted from existance'});
    employees.forEach(employee => {
        print(employee.fname + ' '+ employee.lname);
    });
};

getQuoteQuoteFiredQuoteQuotePeople()

//2
var getMultiplyingPeople = function () {
    const employees = db.employees.find({status: 'multiplying'});
    employees.forEach(employee => {
        print(employee.fname + ' '+ employee.lname);
    });
};

getMultiplyingPeople();

//3
var getWeakPeople = function () {
    const employees = db.employees.find({
        $or: [
            {status: 'wounded'},
            {status: 'dying'}
        ]
    });
    employees.forEach(employee => {
        print(employee.fname + ' '+ employee.lname);
    });
};

getWeakPeople()

//4
var getModeratelyRichPeople = function () {
    const employees = db.employees.find({salary: {$gte: 2000, $lte: 3000}});
    employees.forEach(employee => {
        print(employee.fname + ' '+ employee.lname);
    });
};

getModeratelyRichPeople()

//5
var getPeopleWith2500 = function () {
    const employees = db.employees.find({salary: 2500});
    employees.forEach(employee => {
        print(employee.fname + ' '+ employee.lname);
    });
};

var getPeopleWith3000 = function () {
    const employees = db.employees.find({salary: 3000});
    employees.forEach(employee => {
        print(employee.fname + ' '+ employee.lname);
    });
};

var getPeopleWith3500 = function () {
    const employees = db.employees.find({salary: 3500});
    employees.forEach(employee => {
        print(employee.fname + ' '+ employee.lname);
    });
};

//why is there a huge gap between 3500 and 5000?
var getPeopleWith5000 = function () {
    const employees = db.employees.find({salary: 5000});
    employees.forEach(employee => {
        print(employee.fname + ' '+ employee.lname);
    });
};

getPeopleWith2500()

getPeopleWith3000()

getPeopleWith3500()

getPeopleWith5000()


//6
var getBosses = function () {
    const employees = db.employees.find({manager: {$exists: false}});
    employees.forEach(employee => {
        print(employee.fname + ' '+ employee.lname);
    })
};

getBosses()

//7
var makeOneOldRickFolk = function () {
    const date = new Date();
    date.setFullYear(date.getFullYear() -6);
    const theChosenOne = db.employees.aggregate([{ $sample: { size: 1 } }]).next();
    theChosenOne.salary = 6000;
    theChosenOne.startDate = date;
    dbw.employees.update(theChosenOne);
};

var getOldRichFolks = function () {
    const date = new Date();
    date.setFullYear(date.getFullYear() -5);
    const employees = db.employees.find({salary: {$gte: 5000}, startDate: {$lte: date}}).sort({fname: -1});
    employees.forEach(employee => {
        print(employee.fname + ' '+ employee.lname);
    })
};

makeOneOldRickFolk()

getOldRichFolks()

//8
var getTopGuns = function () {
    const departments = db.employees.distinct('department');

    departments.forEach(department => {
        const topEarners = db.employees.find({department: department}).sort({salary: -1}).limit(5);
        topEarners.forEach(printjson);
    });
};

generateRandomEmployee(100)

getTopGuns();


//9
var getSlaves = function () {
    mindepartments = db.employees.aggregate([
        {
            $group: {
                _id: '$department',
                sum: { $sum: '$salary'}
            }
        },
        {
            $sort: {sum: 1}
        }
    ]);

    let minsum;
    mindepartments.forEach(printjson);
    mindepartments.forEach(row =>{
        if(!minsum || minsum === row.sum) {
            minsum = row.sum;
            print(row._id);
        }
    });
    print(minsum);
};

//10
var avarageMachos = function () {
    const avarages = db.employees.aggregate([
        {
            $group: {
                _id: '$department',
                avg: { $avg: '$salary' }
            }
        }
    ]);

    avarages.forEach(printjson);
};

avarageMachos()

//QUERIES PART 4

//1
var notBGN = function () {
    const result = db.customers.find({
        accounts: {
            $elemMatch: {
                $ne: {currency: 'BGN'}
            }
        }
    });

    result.forEach(printjson);
};

notBGN()

//2
var madaos = function () {
    const result = db.customers.find({
        accounts: {
            $elemMatch: {balance: 0}
        }
    });

    result.forEach(printjson);
};

madaos()

//3
var doubleNameAccounts = function () {
    const result = db.customers.find();

    result.forEach(customer => {
        customer.accounts.forEach(account => {
            account.another_name = customer.fname + ' сметка ' + account.currency;
        });
        dbw.customers.update(customer);
    });
};

