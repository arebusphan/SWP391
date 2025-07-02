using DAL.EmailRepo;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
namespace BLL.EmailService
{
    public class EmailSenderHostedService : BackgroundService
    {
        private readonly IEmailQueue _emailQueue;
        private readonly IServiceProvider _serviceProvider;

        public EmailSenderHostedService(IEmailQueue emailQueue, IServiceProvider serviceProvider)
        {
            _emailQueue = emailQueue;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                if (_emailQueue.TryDequeue(out var message))
                {
                    using var scope = _serviceProvider.CreateScope();
                    var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

                    try
                    {
                        await emailService.SendEmailAsync(message.ToList, message.Subject, message.Body, message.IsHtml);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[EmailSender] Failed: {ex.Message}");
                    }
                }

                await Task.Delay(1000, stoppingToken);
            }
        }
    }
}
