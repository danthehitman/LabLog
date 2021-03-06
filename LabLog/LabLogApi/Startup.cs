﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LabLogApi.Auth;
using LabLogApi.Model;
using LabLogApi.Service;
using Marten;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace LabLogApi
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            if (env.IsDevelopment())
            {
                // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
                builder.AddUserSecrets();
            }
            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddMvc(
                //options =>
                //{
                //    options.SslPort = 44377;
                //    options.Filters.Add(new RequireHttpsAttribute());
                //}
                )
                .AddJsonOptions(options =>
                {
                    // Setup json serializer
                    options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                    options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
                });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("AuthToken",
                                  policy => policy.Requirements.Add(new AuthTokenRequirement()));
            });
            services.AddSingleton<IAuthorizationHandler, AuthTokenHandler>();

            var connectionString = Configuration["ConnectionString"];
            if (Configuration["Authentication:Postgres:Password"] != null)
            {
                connectionString = $"Server=127.0.0.1;Port={Configuration["Authentication:Postgres:Port"]};Database={Configuration["Authentication:Postgres:Database"]};User Id={Configuration["Authentication:Postgres:User"]};Password={Configuration["Authentication:Postgres:Password"]};";
            }

            // Marten document store
            services.AddScoped<IDocumentStore>(provider =>
                DocumentStore.For(_ => {
                    _.Connection(connectionString);
                    _.AutoCreateSchemaObjects = AutoCreate.CreateOrUpdate;
                    _.Schema.For<Post>().Index(x => x.Tags);
                }));

            var clientId = Configuration["GoogleClientId"];
            var clientSecret = Configuration["GoogleClientSecret"];

            if(Configuration["Authentication:Google:ClientID"] != null)
            {
                clientId = Configuration["Authentication:Google:ClientID"];
                clientSecret = Configuration["Authentication:Google:ClientSecret"];
            }

            services.AddScoped<ISessionService>(provider =>
                new SessionService(clientId, clientSecret, DocumentStore.For(connectionString)));

            var db = DocumentStore.For(_ =>
            {
                _.Connection(connectionString);
                _.AutoCreateSchemaObjects = AutoCreate.CreateOrUpdate;
            });
            using (var service = db.LightweightSession())
            {
                var adminEmail = "danthehitman@gmail.com";
                if (! service.Query<User>().Where(u => u.Email == "danthehitman@gmail.com").Any())
                {
                    service.Store(new User
                    {
                        Email = adminEmail,
                        FirstName = "Dan",
                        LastName = "Frank"
                    });
                    service.SaveChanges();
                }
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();
            app.UseDefaultFiles();
            //app.UseDefaultFiles(new DefaultFilesOptions() { DefaultFileNames = new[] { "index.html", "home" } });
            app.UseStaticFiles();

            app.UseMiddleware(typeof(ErrorHandlingMiddleware));
            //app.UseMiddleware<IgnoreRouteMiddleware>();

            app.UseMvc();
        }
    }
}
