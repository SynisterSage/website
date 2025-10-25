import Skeleton from './Skeleton'

export const HomePageSkeleton = () => (
  <div className="min-h-screen page-pad">
    <div className="content-column home-page mb-6">
      {/* Available pill */}
      <div className="mb-6">
        <Skeleton width={180} height={36} className="rounded-full" />
      </div>

      {/* Name */}
      <Skeleton width="60%" height={60} className="mb-6" />

      {/* Description */}
      <Skeleton width="100%" height={24} className="mb-2" />
      <Skeleton width="90%" height={24} className="mb-6" />

      {/* CTA Buttons */}
      <div className="flex gap-4 mb-12">
        <Skeleton width={140} height={48} className="rounded-lg" />
        <Skeleton width={140} height={48} className="rounded-lg" />
      </div>

      {/* About Me Section */}
      <Skeleton width="40%" height={36} className="mb-4" />
      <Skeleton width="100%" height={20} className="mb-2" count={4} />

      {/* Divider */}
      <div className="w-full h-[1px] my-12" />

      {/* Selected Projects */}
      <div className="flex justify-between mb-6">
        <Skeleton width={200} height={32} />
        <Skeleton width={120} height={40} className="rounded-lg" />
      </div>

      {/* Project Cards */}
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton variant="card" height={280} className="mb-2" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

export const ProjectsPageSkeleton = () => (
  <div className="min-h-screen page-pad">
    <div className="content-column projects-page mb-6">
      {/* Title */}
      <Skeleton width={300} height={48} className="mb-6" />

      {/* Search Bar */}
      <Skeleton width={320} height={48} className="rounded-xl mb-6" />

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex gap-2 mb-3">
          <Skeleton width={16} height={16} className="rounded" />
          <Skeleton width={140} height={16} />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} width={100} height={36} className="rounded-full" />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] my-12" />

      {/* Project Cards */}
      <div className="grid gap-8">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="card" height={400} />
        ))}
      </div>
    </div>
  </div>
)

export const ProjectDetailSkeleton = () => (
  <div className="min-h-screen page-pad">
    <div className="content-column mb-6">
      {/* Back Button */}
      <Skeleton width={100} height={36} className="mb-6 rounded-lg" />

      {/* Title */}
      <Skeleton width="70%" height={48} className="mb-4" />

      {/* Meta Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <Skeleton width="100%" height={20} className="mb-2" />
            <Skeleton width="80%" height={24} />
          </div>
        ))}
      </div>

      {/* Description */}
      <Skeleton width="100%" height={20} className="mb-2" count={5} />

      {/* Main Image */}
      <div className="my-6">
        <Skeleton variant="card" height={600} />
      </div>

      {/* Gallery Images */}
      <div className="space-y-6">
        <Skeleton variant="card" height={600} />
        <Skeleton variant="card" height={600} />
      </div>
    </div>
  </div>
)

export const ContactPageSkeleton = () => (
  <div className="min-h-screen page-pad">
    <div className="content-column mb-6">
      {/* Title */}
      <Skeleton width={300} height={48} className="mb-6" />

      {/* Description */}
      <Skeleton width="100%" height={20} className="mb-2" count={2} />

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* Form */}
        <div className="space-y-4">
          <Skeleton width="100%" height={48} className="rounded-lg" />
          <Skeleton width="100%" height={48} className="rounded-lg" />
          <Skeleton width="100%" height={120} className="rounded-lg" />
          <Skeleton width="100%" height={48} className="rounded-lg" />
        </div>

        {/* Contact Card */}
        <div>
          <Skeleton variant="card" height={300} />
        </div>
      </div>
    </div>
  </div>
)

export const AboutPageSkeleton = () => (
  <div className="min-h-screen page-pad">
    <div className="content-column mb-6">
      {/* Title */}
      <Skeleton width={200} height={48} className="mb-6" />

      {/* Content */}
      <Skeleton width="100%" height={20} className="mb-2" count={6} />

      <div className="w-full h-[1px] my-12" />

      {/* Skills Section */}
      <Skeleton width={180} height={36} className="mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} variant="card" height={100} />
        ))}
      </div>
    </div>
  </div>
)
