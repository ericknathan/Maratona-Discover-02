//Biblioteca para criar e inicializar o servidor
const express = require('express');
//Sub-função do express para direcionar rotas
const routes = express.Router();

//Definindo diretório padrão para os arquivos à serem renderizados
const views = __dirname + "/views/"

const Profile = {
    data: {
        name: "Erick",
        avatar: "https://github.com/ericknathan.png",
        "monthly-budget": 3000,
        "hours-per-day": 5,
        "days-per-week": 5,
        "vacation-per-year": 4,
        "value-per-hour": 75
    },

    controllers: {
        index(req, res) {
            return res.render(views + 'profile', { profile: Profile.data });
        },

        update(req, res) {
            // req.body para pegar os dados
            const data = req.body;

            // Definir quantas semanas tem em um ano
            const weeksPerYear = 52;

            // Remover as semanas de férias do ano, para pegar quantas semanas tem em um mês
            const weeksPeMonth = (weeksPerYear - data["vacation-per-year"]) / 12;

            // Total de horas trabalhadas na semana
            const weekTotalHours = data["hours-per-day"] * data["days-per-week"];

            // Total de horas trabalhadas no mês
            const monthlyTotalHours = weekTotalHours * weeksPeMonth;

            // Qual será o valor da minha hora?
            const valueHour = data["monthly-budget"] / monthlyTotalHours;

            Profile.data = {
                ...Profile.data,
                ...req.body,
                "value-per-hour": valueHour
            }

            return res.redirect('/profile')
        }
    }
}

const Job = {
    data: [
        {
            id: 1,
            name: 'Pizzaria Guloso',
            "daily-hours": 2,
            "total-hours": 1, //60
            created_at: Date.now()
        },
        {
            id: 2,
            name: 'OneTwo Project',
            "daily-hours": 3,
            "total-hours": 47,
            created_at: Date.now()
        }
    ],

    controllers: {
        index(req, res) {
            const updatedJobs = Job.data.map((job) => {
                //Ajustes no job
                const remaining = Job.services.remainingDays(job);
                const status = remaining <= 0 ? 'done' : 'progress';
        
                return {
                    ...job,
                    remaining,
                    status,
                    budget: Job.services.calculateBudget(job, Profile.data["value-per-hour"])
                }
            });
        
            return res.render(views + 'index', { jobs: updatedJobs });
        },

        create(req, res) {
            return res.render(views + 'job')
        },

        save(req, res) {
            //{ name: 'asdasd', 'daily-hours': '12', 'total-hours': '10' }
            const lastId = Job.data[Job.data.length - 1]?.id || 0;

            Job.data.push({
                id: lastId + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at: Date.now() // Atribuindo a data de hoje

            });

            return res.redirect('/');
        },

        show(req, res) {

            const jobID = req.params.id;

            const job = Job.data.find(job => Number(job.id) === Number(jobID));

            if(!job) {
                return res.send('Job not found')
            }

            job.budget = Job.services.calculateBudget(job, Profile.data["value-per-hour"])

            return res.render(views + 'job-edit', { job });
        },

        update(req, res) {
            const jobID = req.params.id;

            const job = Job.data.find(job => Number(job.id) === Number(jobID));


            if(!job) {
                return res.send('Job not found')
            }

            const updatedJob = {
                ...job,
                name: req.body.name,
                "total-hours": req.body["total-hours"],
                "daily-hours": req.body["daily-hours"]
            }

            Job.data = Job.data.map(job => {
                if(Number(job.id) === Number(jobID)) {
                    job = updatedJob
                }

                return job;
            });

            res.redirect('/job/' + jobID)
        },

        delete(req, res) {
            const jobID = req.params.id;

            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobID));

            return res.redirect("/")
        }
    },

    services: {
        remainingDays(job) {
            //Calculo de tempo restante
            const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed();
        
            const createdDate = new Date(job.created_at);
            const dueDay = createdDate.getDay() + Number(remainingDays);
            const dueDateInMs = createdDate.setDate(dueDay);
            
            const timeDiffInMs = dueDateInMs - Date.now();
            // Transformando milissegundos em dias
            const dayInMs = 1000 * 60 * 60 * 24;
            const dayDiff = Math.floor(timeDiffInMs / dayInMs);
            
            //Restam X dias
            return dayDiff;
        },

        calculateBudget: (job, valueHour) => valueHour * job["total-hours"]
    }
}

//Renderizando as rotas
routes.get("/", Job.controllers.index);
routes.get("/job", Job.controllers.create);
routes.post("/job", Job.controllers.save);
routes.get("/job/:id", Job.controllers.show);
routes.post("/job/:id", Job.controllers.update);
routes.post("/job/delete/:id", Job.controllers.delete);
routes.get("/profile", Profile.controllers.index);
routes.post("/profile", Profile.controllers.update);


module.exports = routes;