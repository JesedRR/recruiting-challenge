# Written answers — <your name>

> ~200 words per question. Past-tense, real systems. See `SUBMISSION.md`.

## Q1 — Production correctness validation

> Describe a system you owned where you had to add production correctness validation — alarms, contract tests, golden datasets, something that caught a class of bugs before users did. What did you do, what worked, what didn't, and what would you do differently?

A: I implemented a deployment strategy to ensure production stability by using separate environments for testing and production. This was achieved through a Jenkins pipeline configured with a switch case that determined the deployment environment based on the branch name. Branches following the feature/... naming convention were deployed to a test environment, while the master branch was deployed to production. This approach minimized the risk of accidental deployments to production and provided a safe space to test new features before release.

The automation worked well, significantly reducing human error and streamlining the deployment process. Developers could focus on their work without worrying about manual deployment steps. However, one challenge was ensuring that all developers adhered to the branch naming conventions. Any deviation from the expected format could disrupt the deployment process.

In hindsight, I would enhance the pipeline by adding validations to enforce branch naming rules automatically. This would prevent errors early in the process and ensure consistency across the team. Additionally, I would implement monitoring tools to track deployment success rates and identify potential issues proactively. These improvements would further strengthen the reliability of the deployment process and reduce the likelihood of production incidents.



## Q2 — Scaling-forced structural change

> Describe a system you've worked on where scaling — traffic, data volume, team size, or geography — forced a structural change to the code or architecture. What changed, who pushed back, and how did you decide?

A: Although I haven’t faced a direct scaling challenge in my experience, I would approach such situations with a proactive mindset. Scaling issues often arise due to increased traffic, data volume, or team size, and addressing them requires careful planning and execution. My strategy would involve setting up alarms to monitor system performance and detect bottlenecks early. These alarms would provide real-time insights into resource utilization and help identify areas requiring immediate attention.

In addition, I would implement auto-scaling mechanisms to dynamically adjust resources based on demand. For example, in an ecommerce system, traffic spikes during events like "Hot Sale" or Black Friday are predictable. By scaling up resources in advance, the system could handle the increased load without compromising performance or user experience. This would involve optimizing the infrastructure to ensure scalability and reliability.

Furthermore, I would collaborate with stakeholders to plan for long-term scalability. This might include refactoring code, optimizing database queries, or adopting distributed architectures like microservices. While scaling decisions can face resistance due to cost or complexity, I would rely on data-driven insights to justify the changes and ensure alignment across teams. This approach would help maintain system stability and support future growth.


## Q3 — Cross-team contract change

> Describe a time you needed another team to change their API, contract, or shared resource for your work to ship. How did you propose it, how did the other side respond, and how did the change actually land?

A: In one instance, I managed a situation where another team requested changes to the infrastructure I was responsible for. Specifically, they needed to modify the primary key (PK) and sort key (SK) in a DynamoDB table to align with their development conventions. While the request was reasonable, it presented challenges due to AWS permission restrictions and the potential impact on existing workflows. However, since the changes were required in a test environment, we were able to implement them without affecting production.

The process involved close collaboration with the requesting team to understand their requirements and ensure the changes were implemented correctly. Despite the technical challenges, we successfully managed the update and validated the changes in the test environment. However, I emphasized to the team that such changes must be finalized before moving to production to avoid risks and disruptions.

To prevent similar situations in the future, I set a clear deadline for completing all necessary adjustments and communicated the importance of adhering to established processes. This experience highlighted the need for strong communication and clear expectations when working across teams. It also reinforced the importance of maintaining robust infrastructure practices to minimize risks and ensure smooth collaboration.

