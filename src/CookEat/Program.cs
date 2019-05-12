﻿using Microsoft.Owin.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace CookEat
{
    public static class Program
    {
        public static async Task Main(string[] Args)
        {
            var cancellationTokenSource = new CancellationTokenSource();
            var cancellationToken = cancellationTokenSource.Token;
            var dbManager = new DBManager();
            //var crawlerManager = new CrawlerManager(dbManager, cancellationToken);

            var searchManager = new SearchManager(dbManager);
            var userProfileManager = new UserProfileManager(dbManager,searchManager);

            using (WebApp.Start(
                new StartOptions("http://*:80"),
                app =>
                {
                    app.
                        ConfigureAuthentication().
                        UseWebApi(
                            new Dictionary<Type, Func<object>>
                            {
                                [typeof(SearchManager)] = () => searchManager,
                                [typeof(UserProfileManager)] = () => userProfileManager
                            }).
                        ServeStaticFiles(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "frontEnd"));
                }))
            {
                Console.WriteLine("WebServer Started. Press Any Key To Close The Program...");
                Console.ReadKey();
            }

            cancellationTokenSource.Cancel();
        }
    }
}