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
                if (_emailQueue.TryDequeue(out var item))
                {
                    using var scope = _serviceProvider.CreateScope();
                    var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

                    try
                    {
                        if (item.IsBatch)
                        {
                            await emailService.SendEmailAsync(item.Batch!);
                            Console.WriteLine($"✅ Sent {item.Batch!.Count} emails (batch)");
                        }
                        else if (item.Single != null)
                        {
                            await emailService.SendEmailAsync(
                                item.Single.ToList!,
                                item.Single.Subject!,
                                item.Single.Body!,
                                item.Single.IsHtml
                            );
                            Console.WriteLine($"✅ Sent single email to {item.Single.ToList}");
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[EmailSender] Failed: {ex.Message}");
                    }
                }

                await Task.Delay(200, stoppingToken); // ⏱ Tối ưu hơn 1000ms
            }
        }
    }

}
